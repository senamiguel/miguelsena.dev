import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  async headers() {
    return [
      {
        source: '/:path*.asc', 
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Content-Disposition',
            value: 'inline',
          },
        ],
      },
    ];
  },
};

export default nextConfig;