/** Session flag for the opening StoreFlick intro (components/IntroSplash.jsx). */
export const INTRO_SEEN_KEY = 'sf-intro-seen';

/**
 * Runs before first paint (server-rendered ahead of the overlay), so a visitor who already
 * watched the intro this browser session never sees it flash.
 */
export const INTRO_SKIP_SCRIPT = `try{if(sessionStorage.getItem('${INTRO_SEEN_KEY}'))document.documentElement.classList.add('sf-intro-skip')}catch(e){}`;
