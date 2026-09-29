const GOOGLE_TAG = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-EK35PP7RER"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-EK35PP7RER');
</script>`;

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/html")) {
      return response;
    }

    return new HTMLRewriter()
      .on("head", {
        element(element) {
          element.prepend(GOOGLE_TAG, { html: true });
        },
      })
      .transform(response);
  },
};
