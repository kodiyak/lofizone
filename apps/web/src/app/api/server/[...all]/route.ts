async function handler(req: Request, { params }: any) {
  const p = await params;
  console.log('Request parameters:', p);

  const url = new URL(req.url);
  const nextUrl = new URL(
    url.pathname.replace('/api/server', ''),
    process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000',
  );
  console.log(`{ ${req.method}, ${nextUrl.toString()} }`);
  return fetch(nextUrl, {
    method: req.method,
    headers: {
      ...Object.fromEntries(req.headers.entries()),
      'Content-Type': 'application/json',
    },
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : null,
  }).then((response) => {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
  handler as HEAD,
};
