const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const modules = [
  'trades',
  'journal',
  'strategies',
  'tags',
  'analytics',
  'tax',
  'upload',
  'prop',
  'notifications',
  'auth'
];

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

for (const mod of modules) {
  const modDir = path.join(srcDir, mod);
  const dtoDir = path.join(modDir, 'dto');
  
  if (!fs.existsSync(modDir)) fs.mkdirSync(modDir, { recursive: true });
  if (!fs.existsSync(dtoDir)) fs.mkdirSync(dtoDir, { recursive: true });

  const ModName = capitalize(mod);
  const isAuth = mod === 'auth';
  const hasRepo = !isAuth && mod !== 'notifications';

  // Module
  fs.writeFileSync(path.join(modDir, `${mod}.module.ts`), `import { Module } from '@nestjs/common';
import { ${ModName}Controller } from './${mod}.controller';
import { ${ModName}Service } from './${mod}.service';
${hasRepo ? `import { ${ModName}Repository } from './${mod}.repository';` : ''}

@Module({
  controllers: [${ModName}Controller],
  providers: [${ModName}Service${hasRepo ? `, ${ModName}Repository` : ''}],
  exports: [${ModName}Service],
})
export class ${ModName}Module {}
`);

  // Controller
  fs.writeFileSync(path.join(modDir, `${mod}.controller.ts`), `import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { ${ModName}Service } from './${mod}.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { Request } from 'express';

@Controller('${mod}')
@UseGuards(ClerkGuard)
export class ${ModName}Controller {
  constructor(private readonly ${mod}Service: ${ModName}Service) {}

  @Get()
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async findAll(@Req() req: Request) {
    return this.${mod}Service.findAll(req.clerkUserId!);
  }

  @Get(':id')
  @RateLimit({ limit: 120, windowSeconds: 60 })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return this.${mod}Service.findOne(id, req.clerkUserId!);
  }
}
`);

  // Service
  fs.writeFileSync(path.join(modDir, `${mod}.service.ts`), `import { Injectable, NotFoundException } from '@nestjs/common';
${hasRepo ? `import { ${ModName}Repository } from './${mod}.repository';` : ''}

@Injectable()
export class ${ModName}Service {
  constructor(${hasRepo ? `private readonly ${mod}Repository: ${ModName}Repository` : ''}) {}

  async findAll(userId: string) {
    ${hasRepo ? `return this.${mod}Repository.findAll(userId);` : `return [];`}
  }

  async findOne(id: string, userId: string) {
    ${hasRepo ? `return this.${mod}Repository.findOne(id, userId);` : `return null;`}
  }
}
`);

  // Repository (Skip for auth/notifications)
  if (hasRepo) {
    fs.writeFileSync(path.join(modDir, `${mod}.repository.ts`), `import { Injectable } from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { eq } from 'drizzle-orm';
// import { ${mod} } from '@thirdleaf/db'; // Update the import once schemas match

@Injectable()
export class ${ModName}Repository {
  async findAll(userId: string) {
    // return db.select().from(${mod}).where(eq(${mod}.userId, userId));
    return [];
  }

  async findOne(id: string, userId: string) {
    // const results = await db.select().from(${mod}).where(and(eq(${mod}.id, id), eq(${mod}.userId, userId)));
    return null;
  }
}
`);
  }
}

console.log("Scaffolded " + modules.length + " modules successfully.");
