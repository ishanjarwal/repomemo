/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  allowedDevOrigins: ["noncarnivorous-unhectored-lilyanna.ngrok-free.dev"], // for clerk webooks
};

export default config;
