/// <reference path="../.astro/types.d.ts" />
import PocketBase from "pocketbase";

/// <reference types="vite/client" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SG_API_KEY: string;
  readonly PB_URL: string;
  readonly PB_AUTH_EMAIL: string;
  readonly PB_AUTH_PASS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace App {
    interface Locals {
      pb: PocketBase;
      user: PocketBase.authStore.model | undefined;
    }
  }
}

export {};
