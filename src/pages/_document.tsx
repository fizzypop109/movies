import {Html, Head, Main, NextScript} from "next/document";
import Meta from "@/components/Meta";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <Meta />
            </Head>
            <body className="antialiased">
            <Main/>
            <NextScript/>
            </body>
        </Html>
    );
}
