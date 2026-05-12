import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    permissions: Record<string, boolean>;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      permissions: Record<string, boolean>;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    permissions: Record<string, boolean>;
  }
}
