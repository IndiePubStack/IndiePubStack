export function getSettings() {
    return {
        domain: process.env.DOMAIN,
        publicationName: process.env.PUBLICATION_NAME || 'IndiePubStack',
        resendDomain: process.env.RESEND_DOMAIN,
        resendAudienceId: process.env.RESEND_AUDIENCE_ID,
        lightCodeTheme: process.env.LIGHT_CODE_THEME || 'catppuccin-latte',
        darkCodeTheme: process.env.DARK_CODE_THEME || 'gruvbox-dark-soft',
        gaId: process.env.GA_ID,
    }
}