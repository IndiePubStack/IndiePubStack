import * as React from 'react';
import {Html, Text, Heading} from "@react-email/components";
import {EmailMarkdown} from "md-to-react-email"

import {
    Body,
    Container,
    Head,
    Hr,
    Preview
} from '@react-email/components';

import {
    Tailwind,
} from '@react-email/components';
import type { TailwindConfig } from "@react-email/tailwind";
import type {Resend} from "resend";
import {Post} from "@/lib/schema";
import {getSettings} from "@/lib/settings";

const tailwindConfig: TailwindConfig = {
    theme: {
        fontSize: {
            xs: ["12px", { lineHeight: "16px" }],
            sm: ["14px", { lineHeight: "20px" }],
            base: ["16px", { lineHeight: "24px" }],
            lg: ["18px", { lineHeight: "28px" }],
            xl: ["20px", { lineHeight: "28px" }],
            "2xl": ["24px", { lineHeight: "32px" }],
            "3xl": ["30px", { lineHeight: "36px" }],
            "4xl": ["36px", { lineHeight: "36px" }],
            "5xl": ["48px", { lineHeight: "1" }],
            "6xl": ["60px", { lineHeight: "1" }],
            "7xl": ["72px", { lineHeight: "1" }],
            "8xl": ["96px", { lineHeight: "1" }],
            "9xl": ["144px", { lineHeight: "1" }],
        },
        spacing: {
            px: "1px",
            0: "0",
            0.5: "2px",
            1: "4px",
            1.5: "6px",
            2: "8px",
            2.5: "10px",
            3: "12px",
            3.5: "14px",
            4: "16px",
            5: "20px",
            6: "24px",
            7: "28px",
            8: "32px",
            9: "36px",
            10: "40px",
            11: "44px",
            12: "48px",
            14: "56px",
            16: "64px",
            20: "80px",
            24: "96px",
            28: "112px",
            32: "128px",
            36: "144px",
            40: "160px",
            44: "176px",
            48: "192px",
            52: "208px",
            56: "224px",
            60: "240px",
            64: "256px",
            72: "288px",
            80: "320px",
            96: "384px",
        },
    },
}

export function broadcastEmail(resend: Resend, post: Post) {
    const settings = getSettings();
    return resend.broadcasts.create({
        name: "/" + post.id + "/" + post.title!,
        audienceId: settings.resendAudienceId!,
        previewText: post.subTitle || post.title!,
        from: `${settings.publicationName} <no-reply@${settings.resendDomain}>`,
        subject: post.title!,
        react: <NewsletterEmailTemplate post={post} />
    });
}

export function NewsletterEmailTemplate({post}: {post: Post}) {
    return (
        <Html>
            <Head />
            <Tailwind config={tailwindConfig}>
                <Body className="mx-auto my-auto bg-white px-2 font-sans text-lg">
                    <Preview>{post.subTitle || post.title!}</Preview>
                    <Container className="mx-auto my-1 max-w-3xl p-5">
                        <Heading className="mx-0 my-30 p-0 text-3xl font-bold ">
                            {post.title}
                        </Heading>
                        <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
                        <Text className="text ">
                            {post.subTitle}
                        </Text>
                        <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />

                        <EmailMarkdown markdown={post.content!} />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
