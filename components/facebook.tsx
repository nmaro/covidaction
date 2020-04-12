export const Facebook = () => (
  <a
    href={`https://www.facebook.com/v6.0/dialog/oauth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.ORIGIN}/api/auth&state=login`}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >
    Log in with Facebook
  </a>
);
