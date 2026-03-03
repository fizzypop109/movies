import {Html, Head, Main, NextScript} from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
      (function() {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) {
          document.documentElement.classList.add('dark');
        }
      })();
    `,
                    }}
                />
            </Head>
            <body className="antialiased">
            <Main/>
            <NextScript/>
            </body>
        </Html>
    );
}
