import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { SyncService } from './sync.service';

@Processor('broker-sync')
export class SyncProcessor extends WorkerHost {
  private readonly logger = new Logger(SyncProcessor.name);

  constructor(private readonly syncService: SyncService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing sync job ${job.id} for user ${job.data.userId || job.data.connectionId}`);
    
    if (job.data.type === 'sync-connection') {
      const result = await this.syncService.syncBrokerTrades(job.data.connectionId, job.data.triggeredBy);
      return result;
    }

    if (job.data.type === 'sync-user') {
      const results = await this.syncService.syncAllBrokers(job.data.userId, job.data.triggeredBy);
      
      const summary = results.map((r: any) => {
        if (r.status === 'fulfilled') {
          return {
            connectionId: r.value.connectionId,
            broker: r.value.broker,
            new: r.value.newTrades ?? 0,
            dupes: r.value.duplicates ?? 0,
          };
        }
        return { error: r.reason?.message ?? 'Unknown sync error' };
      });

      return { summary };
    }

    return { processed: true };
  }
}
