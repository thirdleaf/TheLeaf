import { ZerodhaConnector } from '../connectors/zerodha.connector';
import { DhanConnector } from '../connectors/dhan.connector';

async function verify() {
  console.log("🔍 Verifying Broker Connectors...");

  const zerodha = new ZerodhaConnector();
  const dhan = new DhanConnector();

  const zUrl = zerodha.getAuthUrl("my_api_key", "http://localhost/callback");
  console.log("Zerodha Login URL:", zUrl);
  if (zUrl.includes("api_key=my_api_key") && zUrl.includes("kite.zerodha.com")) {
    console.log("✅ Zerodha Auth URL check passed");
  } else {
    console.error("❌ Zerodha Auth URL check failed");
  }

  const dUrl = dhan.getAuthUrl("my_client_id", "http://localhost/callback", "state123");
  console.log("Dhan Login URL:", dUrl);
  if (dUrl.includes("client_id=my_client_id") && dUrl.includes("login.dhan.co")) {
    console.log("✅ Dhan Auth URL check passed");
  } else {
    console.error("❌ Dhan Auth URL check failed");
  }
}

verify().catch(console.error);
