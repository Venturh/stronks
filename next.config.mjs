/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
    swcMinify: true,
	images: {
		domains: ['lh3.googleusercontent.com', 'api.multiavatar.com'],
	},
};

export default config;
