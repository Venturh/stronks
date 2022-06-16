import { GetServerSideProps } from 'next';
import { NextAuthOptions } from 'next-auth';
import { signIn } from 'next-auth/react';
import { object, string } from 'zod';

import LandingLayout from 'components/layouts/LandingLayout';
import Form from 'components/ui/Form';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';

import { unauthenticatedRoute } from 'utils/redirects';
import { useFormValidation } from 'hooks/useForm';

const title = 'Sign in';
const description = 'Welcome back.';

const loginSchema = object({
	email: string().nonempty().email(),
});

function Login({}: NextAuthOptions) {
	const form = useFormValidation({
		schema: loginSchema,
	});

	return (
		<LandingLayout title={title} description={description}>
			<div className="w-full max-w-md pt-12 m-auto space-y-4">
				<div className="flex flex-col w-full max-w-sm p-3 mx-auto space-y-3 rounded-lg shadow-sm ring dark:shadow-none bg-secondary ring-accent-primary">
					<div className="space-y-2">
						<h1 className="text-5xl font-semibold">{title}</h1>
						<h2 className="text-2xl text-secondary">{description}</h2>
					</div>
					<Form
						name="login"
						submitButtonText="Login"
						form={form}
						onSubmit={({ email }) => signIn('email', { email })}
						disabled
					>
						<Input
							disabled
							label="Email"
							type="email"
							autoComplete="email"
							{...form.register('email')}
						/>
					</Form>

					<div className="relative mt-6">
						<div className="absolute inset-0 flex items-center" aria-hidden="true">
							<div className="w-full border-t border-accent-primary"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 text-secondary">Or continue with</span>
						</div>
					</div>

					<div className="flex flex-col space-y-2">
						<Button
							className="w-full"
							variant="outline"
							onClick={() => signIn('google', { callbackUrl: '/' })}
						>
							<div className="inline-flex space-x-4">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
									<path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" />
								</svg>
								<span>Sign in with Google</span>
							</div>
						</Button>
					</div>
				</div>
			</div>
		</LandingLayout>
	);
}

export const getServerSideProps: GetServerSideProps = unauthenticatedRoute;

export default Login;
