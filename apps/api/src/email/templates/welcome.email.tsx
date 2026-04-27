import React from "react";
import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Preview,
  Section,
  Text,
  Link,
  Button
} from "@react-email/components";

const brandColor = "#4f46e5"; // Indigo 600

export const WelcomeEmail = ({ name = "Trader" }: { name: string }) => (
  <Html>
    <Head />
    <Preview>Welcome to TradeForge — Your ultimate trading journal awaits</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Welcome to TradeForge, {name}!</Heading>
        </Section>
        
        <Section style={body}>
          <Text style={text}>
            We're thrilled to have you on board. TradeForge is built for serious traders who want to treat their trading like a professional business.
          </Text>
          
          <Text style={subheader}>Quick Start Guide:</Text>
          
          <Section style={featuresBlock}>
            <Text style={featureText}>
              <strong>🔗 Connect Your Broker:</strong> Auto-import your trades from Zerodha, AngelOne, Upstox, and more.
            </Text>
            <Text style={featureText}>
              <strong>📝 Start Journaling:</strong> Log your daily psychological state and plan compliance.
            </Text>
            <Text style={featureText}>
              <strong>📊 Review Analytics:</strong> Discover what setups are actually making you money.
            </Text>
          </Section>

          <Section style={btnContainer}>
            <Button style={button} href="https://app.tradeforge.in/app/trades/new">
              Complete your first journal entry
            </Button>
          </Section>

          <Text style={footer}>
            Need help? Reply to this email or visit our community.
            <br /><br />
            <Link href="https://app.tradeforge.in/settings/notifications" style={unsubscribeLink}>
              Unsubscribe from these emails
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = { backgroundColor: "#ffffff", margin: "0 auto", padding: "20px 0 48px", marginBottom: "64px" };
const header = { padding: "0 48px" };
const body = { padding: "0 48px" };
const h1 = { color: "#111827", fontSize: "24px", fontWeight: "bold", paddingTop: "32px", paddingBottom: "16px" };
const text = { color: "#374151", fontSize: "16px", lineHeight: "24px" };
const subheader = { color: "#111827", fontSize: "18px", fontWeight: "bold", marginTop: "24px", marginBottom: "16px" };
const featuresBlock = { backgroundColor: "#f3f4f6", padding: "24px", borderRadius: "8px", marginBottom: "24px" };
const featureText = { color: "#4b5563", fontSize: "15px", lineHeight: "24px", margin: "8px 0" };
const btnContainer = { textAlign: "center" as const, marginTop: "32px", marginBottom: "32px" };
const button = { backgroundColor: brandColor, borderRadius: "8px", color: "#fff", fontSize: "16px", fontWeight: "bold", textDecoration: "none", textAlign: "center" as const, display: "block", padding: "12px" };
const footer = { color: "#9ca3af", fontSize: "14px", lineHeight: "24px", marginTop: "48px" };
const unsubscribeLink = { color: "#9ca3af", textDecoration: "underline" };
