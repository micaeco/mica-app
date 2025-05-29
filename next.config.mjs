import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("src/app/_i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default withNextIntl(nextConfig);
