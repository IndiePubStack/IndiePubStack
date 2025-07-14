export function getSettings() {
    return {
        domain: process.env.DOMAIN,
        publicationName: process.env.PUBLICATION_NAME || 'IndiePubStack',
        resendDomain: process.env.RESEND_DOMAIN,
        resendAudienceId: process.env.RESEND_AUDIENCE_ID,
        codeTheme: process.env.CODE_THEME || 'one-dark-pro',
    }
}