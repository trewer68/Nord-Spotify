// @ts-chec

// NAME: Nord Spotify
// AUTHOR: Tetrax-10
// DESCRIPTION: Nord Spotify Extension

/// <reference path="../dev/globals.d.ts" />

(async function nord() {
    if (!Spicetify.Platform) {
        setTimeout(nord, 300);
        return;
    }
    await initNord();
})();

async function initNord() {
    const { React } = Spicetify;
    const { useState } = React;

    let versionInfo = await Spicetify.CosmosAsync.get("sp://desktop/v1/version");

    let userConfig = Spicetify.Config;

    let body = await waitForElement("body", 5000);

    let isNewUI = await isNewUIFunc();

    let isPremium = await isPremiumFunc();

    let server = "https://tetrax-10.github.io/Nord-Spotify/";

    let isMarketplace = userConfig.current_theme == "Nord Spotify" ? true : false;

    ////////////////////////////////////// CONFIG ///////////////////////////////////////////

    async function getLocalStorageDataFromKey(key) {
        return Spicetify.LocalStorage.get(key);
    }

    async function setLocalStorageDataWithKey(key, value) {
        Spicetify.LocalStorage.set(key, value);
    }

    async function getConfig() {
        try {
            const parsed = JSON.parse(await getLocalStorageDataFromKey("nord:settings"));
            if (parsed && typeof parsed === "object") {
                return parsed;
            }
            throw "Config Error Nord";
        } catch {
            await setLocalStorageDataWithKey("nord:settings", `{}`);
            return {};
        }
    }

    const defaultSettings = {
        artistBigImage: true,
        customFont: true,
        betterGenre: true,
        betterLyricsPlus: true,
        betterSpotifyLyrics: true,
        boldedSideBarItems: true,
        bubbleUI: true,
        hideAds: true,
        hideCardsDownloadStatus: true,
        hideCurrentPlayingSongBG: false,
        hideDotsUnderPlayerButtons: true,
        hideFriendActivity: false,
        hideHomePageRecommendation: false,
        hideLikedSongsCard: false,
        hideLikedSongsCardTexts: false,
        hidePlaylistImageEditButton: false,
        hideRadioGradient: true,
        hideSideBarDivider: true,
        hideSideBarDownloadStatus: true,
        hideSideBarScrollBar: true,
        hideSideBarStatus: true,
        hideSimilarSongsRecommendation: false,
        hideSpotifyConnect: false,
        hideSpotifyFullScreen: false,
        hideTopBarPlayButton: true,
        hideTopGradient: true,
        hideWindowsControls: true,
        hideWindowsControlsHeight: "31",
        hideWindowsControlsWidth: "135",
        hideWindowsControlsFilter: "2.13",
        highlightSideBarItem: true,
        highlightSideBarSelectedItem: true,
        nordLyrics: true,
        pointers: true,
        rightSideCoverArt: true,
        hideMarketplace: false,
        quickSearch: false,
        search: false,
        redo: false,
        darkSideBar: false,
        dev: false,
        localCSS: false,
        reload: false,
        customFontURL: "https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap",
        customFontName: "Quicksand",
    };

    async function saveConfig() {
        await setLocalStorageDataWithKey("nord:settings", JSON.stringify(CONFIG));
    }

    let CONFIG = await getConfig();

    function initConfigItems(item, value) {
        if (CONFIG[item] == undefined) {
            CONFIG[item] = value;
        } else {
            return;
        }
    }

    Object.keys(defaultSettings).forEach((key) => {
        initConfigItems(key, defaultSettings[key]);
    });

    await saveConfig();

    ////////////////////////////////////// Preprocessor ///////////////////////////////////////////

    if (CONFIG.dev && CONFIG.localCSS) {
        server = "";
    } else {
        injectStyleSheet(`${server}src/nord.css`, "nord--nordSpotify");
    }

    if (isNewUI) {
        injectStyleSheet(`${server}src/Snippets/NewUI.css`, "nord--NewUI");
    } else {
        injectStyleSheet(`${server}src/Snippets/OldUI.css`, "nord--OldUI");
    }

    let windowsControlsValues = {
        hideWindowsControlsHeight: CONFIG.hideWindowsControlsHeight ? CONFIG.hideWindowsControlsHeight : "96.2",
        hideWindowsControlsWidth: CONFIG.hideWindowsControlsWidth ? CONFIG.hideWindowsControlsWidth : "83.4",
        hideWindowsControlsFilter: CONFIG.hideWindowsControlsFilter ? CONFIG.hideWindowsControlsFilter : "2.13",
    };

    ////////////////////////////////////// CSS Snippets ///////////////////////////////////////////

    let hideArtistTopBarNew = `
    .main-topBar-background {
        background-color: unset !important;
    }
    .main-topBar-overlay {
        background-color: unset !important;
    }
    .main-entityHeader-topbarTitle {
        background-color: var(--spice-main);
        padding: 10px;
        width: 100%;
        padding-top: 15px;
        padding-left: 32px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        position: absolute;
        left: 0px;
        transition: all 0s ease;
    }`;

    let hideArtistTopBarOld = `
    .main-topBar-background {
        background-color: unset !important;
    }
    .main-topBar-overlay {
        background-color: unset !important;
    }
    .main-entityHeader-topbarTitle {
        background-color: var(--spice-main);
        padding: 10px;
        width: 100%;
        padding-top: 15px;
        padding-left: 32px;
        position: absolute;
        left: 0px;
        transition: all 0s ease;
    }`;

    let rightSideCoverArtNew = `
    /* right side cover art */
    .main-nowPlayingWidget-nowPlaying > .ellipsis-one-line,
    .main-trackInfo-container {
        margin-left: 74px;
    } /* static cover */
    .main-coverSlotExpanded-container {
        border-radius: 10px;
        position: fixed;
        top: calc(100% - 307px);
        left: calc(100% - 208px);
        width: 200px;
        height: 200px;
        visibility: hidden;
        transform-origin: center;
        animation: 1s coverExpandedIn;
        animation-fill-mode: forwards;
    } /* dynamic cover */
    .main-coverSlotCollapsed-container[aria-hidden="true"] {
        left: calc(100vw - 162px);
        top: -231px;
        width: 200px;
        height: 200px;
        visibility: hidden;
        animation: 1s coverExpandedOut;
    }
    .main-coverSlotExpanded-exitActive {
        display: none;
    }
    @keyframes coverExpandedIn {
        99% {
            visibility: hidden;
        }
        100% {
            visibility: visible;
        }
    }
    @keyframes coverExpandedOut {
        99% {
            visibility: visible;
        }
        100% {
            visibility: hidden;
        }
    }
    .main-coverSlotCollapsed-container {
        position: fixed;
        top: -6px;
        left: 0px;
        width: 56px;
        height: 56px;
        visibility: visible;
        z-index: 1;
    }
    .cover-art .cover-art-image,
    .main-coverSlotCollapsed-container {
        transform-origin: center;
        transition-timing-function: ease-in;
        transition: width 0.5s 0.2s, height 0.5s 0.2s, top 0.3s, left 0.5s;
    }
    .main-coverSlotCollapsed-container[aria-hidden="false"] {
        transition-timing-function: ease-out !important;
        transition: width 0.5s 0.2s, height 0.5s 0.2s, top 0.5s 0.1s, left 0.3s !important;
    }
    .main-coverSlotCollapsed-container[aria-hidden="true"] .cover-art .cover-art-image,
    .main-nowPlayingWidget-coverExpanded .main-coverSlotCollapsed-container .cover-art .cover-art-image {
        width: 200px;
        height: 200px;
    }
    .main-nowPlayingBar-left {
        z-index: 2;
    }
    .main-nowPlayingBar-center {
        z-index: 1;
    }
    .cover-art {
        background-color: transparent;
    }`;

    let rightSideCoverArtOld = `
    /* right side cover art */
    .main-nowPlayingWidget-nowPlaying > .ellipsis-one-line,
    .main-trackInfo-container {
        margin-left: 74px;
    }
    /* static cover */
    .main-coverSlotExpanded-container {
        border-radius: 10px;
        position: fixed;
        top: calc(100% - 300px);
        left: calc(100% - 210px);
        width: 200px;
        height: 200px;
        visibility: hidden;
        transform-origin: center;
        animation: 1s coverExpandedIn;
        animation-fill-mode: forwards;
    }
    /* dynamic cover */
    .main-coverSlotCollapsed-container[aria-hidden="true"] {
        left: calc(100vw - 154px);
        top: -233px;
        width: 200px;
        height: 200px;
        visibility: hidden;
        animation: 1s coverExpandedOut;
    }
    .main-coverSlotExpanded-exitActive {
        display: none;
    }
    @keyframes coverExpandedIn {
        99% {
            visibility: hidden;
        }
        100% {
            visibility: visible;
        }
    }
    @keyframes coverExpandedOut {
        99% {
            visibility: visible;
        }
        100% {
            visibility: hidden;
        }
    }
    .main-coverSlotCollapsed-container {
        position: fixed;
        top: -6px;
        left: 0px;
        width: 56px;
        height: 56px;
        visibility: visible;
        z-index: 1;
    }
    .cover-art .cover-art-image,
    .main-coverSlotCollapsed-container {
        transform-origin: center;
        transition-timing-function: ease-in;
        transition: width 0.5s 0.2s, height 0.5s 0.2s, top 0.3s, left 0.5s;
    }
    .main-coverSlotCollapsed-container[aria-hidden="false"] {
        transition-timing-function: ease-out !important;
        transition: width 0.5s 0.2s, height 0.5s 0.2s, top 0.5s 0.1s, left 0.3s !important;
    }
    .main-coverSlotCollapsed-container[aria-hidden="true"] .cover-art .cover-art-image,
    .main-nowPlayingWidget-coverExpanded .main-coverSlotCollapsed-container .cover-art .cover-art-image {
        width: 200px;
        height: 200px;
    }
    .main-nowPlayingBar-left {
        z-index: 2;
    }
    .main-nowPlayingBar-center {
        z-index: 1;
    }
    .cover-art {
        background-color: transparent;
    }`;

    let leftSideCoverArt = `
    /* hide small cover art when expanded */
    .main-nowPlayingWidget-coverExpanded .main-coverSlotCollapsed-container.main-coverSlotCollapsed-navAltContainer {
        visibility: hidden;
    }`;

    let hideHomePageRecommendation = `
    /* disable homepage recommendation */
    section[data-testid="home-page"] .main-shelf-shelf:not([aria-label="Recently played"]) {
        display: none !important;
    }`;

    let hideLikedSongsCard = `
    /* remove liked songs card in your library */
    .main-heroCard-card.collection-collectionEntityHeroCard-likedSongs.collection-collectionEntityHeroCard-container {
        display: none;
    }`;

    let hideLikedSongsCardTexts = `
    /* blue like card useless text in your library */
    .collection-collectionEntityHeroCard-tracksContainer {
        display: none;
    }`;

    let hideSimilarSongsRecommendation = `
    /* disable similar song suggestion in playlist */
    .playlist-playlist-seeMore,
    .playlist-playlist-playlistInlineCurationSection,
    .playlist-playlist-searchResultListContainer,
    .playlist-playlist-recommendedTrackList {
        display: none !important;
    }`;

    let hidePlaylistImageEditButton = `
    /* remove playlist edit image button */
    .main-editImageButton-overlay {
        display: none;
    }`;

    let hideRadioGradient = `
    /* radio gradient hidden */
    .KNUIWLKuuA1qIkTt4jus:after {
        background: none !important;
    }`;

    let hideSideBarStatus = `
    /* hide sidebar status */
    .main-rootlist-statusIcons {
        display: none;
    }`;

    let hideCardsDownloadStatus = `
    /* hide cards download status */
    .main-card-DownloadStatusIndicator {
        display: none;
    }`;

    let nordLyrics = `
    /* spotify lyrics background norded */
    .lyrics-lyrics-container * {
        --lyrics-color-active: var(--spice-text);
        --lyrics-color-background: none;
        --lyrics-color-inactive: rgba(var(--spice-rgb-text), 0.7);
        --lyrics-color-messaging: var(--spice-text);
    }`;

    let hideFriendActivity = `
    /* hide friend activity */
    .main-nowPlayingBar-right button[aria-label="Friend Activity"] {
        display: none;
    }`;

    let hideSpotifyConnect = `
    /* hide spotify connect */
    .PrhIVExjBkmjHt6Ea4XE {
        display: none;
    }`;

    let hideAds = `
    /* upgrade button top bar */
    button[title="Upgrade to Premium"],
    button[aria-label="Upgrade to Premium"],
    .main-topBar-UpgradeButton,
    /* top bar user context menu Upgrade to Premium */
    .main-contextMenu-menuItem a[href="https://www.spotify.com/premium/"],
    /* top side ads */
    .WiPggcPDzbwGxoxwLWFf,
    /* bottom ads */
    .main-leaderboardComponent-container,
    /* popup video ad */
    .Root__modal-slot .GenericModal__overlay.QMMTQfEw3AIHFf4dTRp3.nPKDEvIoCzySBR24pZiN {
        display: none !important;
    }

    /* no idea what these are */
    .Root__ads-container-desktop--is-hidden,
    .sponsor-container,
    .desktoproutes-homepage-takeover-ad-hptoComponent-parentContainer {
        display: none !important;
    }`;

    let hideSideBarScrollBar = `
    /* hides sidebar scrollbar */
    .os-scrollbar:nth-child(6) .os-scrollbar-handle {
        visibility: hidden;
    }`;

    let highlightSideBarItem = `
    /* sidebar selected item (main items) */
    .personal-library .main-collectionLinkButton-collectionLinkButton.main-collectionLinkButton-selected.active,
    .main-navBar-navBarItem .main-navBar-navBarLinkActive {
        background-color: var(--spice-custom-main-soft-secondary);
        border-radius: 10px;
    }`;

    let highlightSideBarSelectedItem = `
    /* sidebar selected playlist */
    .main-rootlist-rootlistItem .main-rootlist-rootlistItemLinkActive:hover,
    .main-rootlist-rootlistItem .main-rootlist-rootlistItemLinkActive {
        color: var(--spice-custom-link-hover) !important;
    }`;

    let boldedSideBarItems = `
    /* sidebar playlist names */
    .main-rootlist-rootlistItem span {
        font-weight: bold;
    }`;

    let hideSideBarDivider = `
    /* sidebar divider invisible */
    .LayoutResizer__resize-bar {
        background: none;
    }`;

    let hideTopGradient = `
    /* Hide playlist gradient top */
    .main-entityHeader-backgroundColor {
        display: none !important;
    }
    /* Hide playlist gradient bottom */
    .main-actionBarBackground-background {
        display: none !important;
    }
    /* remove gradient color on home screen */
    .main-home-homeHeader {
        display: none !important;
    }`;

    let hideCurrentPlayingSongBG = `
    /* current playing song background */
    div.main-rootlist-wrapper > div:nth-child(2) > div .main-trackList-active {
        border-radius: 10px;
        background-color: rgba(var(--spice-rgb-custom-main-soft-secondary), 0.6);
    }`;

    let betterGenre = `
    /* seearch page genre card background */
    .x-categoryCard-CategoryCard {
        background-color: var(--spice-custom-main-soft-secondary) !important;
        padding-bottom: 30px;
        transition: transform, 0s, ease, 0.25s;
    }
    .x-categoryCard-CategoryCard:hover {
        background-color: var(--spice-custom-main-secondary) !important;
        transition: transform, 0s, ease, 0.25s;
    }
    /* search page genre images */
    .tV9cjMpTPaykKsn2OVsw {
        border-radius: 10px;
    }`;

    let artistBigImage = `
    /* Artist big image */
    .main-entityHeader-withBackgroundImage .main-entityHeader-headerText {
        position: fixed;
        justify-content: center;
        bottom: 3%;
    }
    .main-entityHeader-container.main-entityHeader-nonWrapped.main-entityHeader-withBackgroundImage {
        padding-left: 3%;
    }
    .main-entityHeader-background.main-entityHeader-overlay {
        display: none;
    }`;

    let artistBigImageNew = `
    .main-entityHeader-container.main-entityHeader-withBackgroundImage,
    .main-entityHeader-background,
    .main-entityHeader-background.main-entityHeader-overlay:after {
        height: calc(100vh - 105px) !important;
    }`;

    let artistBigImageOld = `
    .main-entityHeader-container.main-entityHeader-withBackgroundImage,
    .main-entityHeader-background,
    .main-entityHeader-background.main-entityHeader-overlay:after {
        height: calc(100vh - 90px) !important;
    }`;

    let hideTopBarPlayButton = `
    /* remove play button from topbar */
    :root .Root__top-bar header .main-playButton-PlayButton {
        display: none !important;
    }`;

    let hideDotsUnderPlayerButtons = `
    /* hide dots under active button */
    .main-shuffleButton-button.main-shuffleButton-active:after,
    .main-repeatButton-button.main-repeatButton-active:after,
    /* queue */
    .control-button--active-dot:after {
        display: none;
    }`;

    let pointers = `
    button,
    .show-followButton-button,
    .main-dropDown-dropDown,
    .x-toggle-wrapper,
    .main-playlistEditDetailsModal-closeBtn,
    .main-trackList-rowPlayPauseButton,
    .main-rootlist-rootlistItemLink:link,
    .main-rootlist-rootlistItemLink:visited,
    .x-sortBox-sortDropdown,
    .main-contextMenu-menuItemButton,
    .main-trackList-column,
    .main-moreButton-button,
    .x-downloadButton-button,
    .main-playButton-PlayButton,
    .main-coverSlotExpandedCollapseButton-chevron,
    .main-coverSlotCollapsed-chevron,
    .control-button:focus,
    .control-button:hover,
    .main-repeatButton-button,
    .main-skipForwardButton-button,
    .main-playPauseButton-button,
    .main-skipBackButton-button,
    .main-shuffleButton-button,
    .main-addButton-button,
    .progress-bar__slider,
    .playback-bar,
    .main-editImageButton-image,
    .X1lXSiVj0pzhQCUo_72A  /* collaborate button in playlist */ ,
    #spicetify-playlist-list .main-rootlist-wrapper /* sidebar playlist hover */ {
        cursor: pointer !important;
    }`;

    let betterSpotifyLyrics = `
    /* better spotify lyrics style  */
    .lyrics-lyrics-contentContainer .lyrics-lyricsContent-lyric.lyrics-lyricsContent-highlight {
        filter: blur(1.5px);
        padding: 15px;
        font-size: 110%;
    }
    .lyrics-lyrics-contentContainer .lyrics-lyricsContent-lyric.lyrics-lyricsContent-active {
        filter: none;
        padding: 20px;
        font-size: 140%;
    }
    .lyrics-lyrics-contentContainer .lyrics-lyricsContent-lyric {
        filter: blur(1.5px);
        padding: 15px;
        font-size: 110%;
    }
    .lyrics-lyrics-contentContainer .lyrics-lyricsContent-lyric.lyrics-lyricsContent-unsynced {
        filter: none;
        padding: 10px;
        font-size: 100%;
    }`;

    let betterLyricsPlus = `
    /* lyrics plus compact off style */
    .lyrics-lyricsContainer-LyricsContainer .lyrics-lyricsContainer-LyricsLine.lyrics-lyricsContainer-LyricsLine-active {
        padding: 15px;
        filter: none;
        font-size: 250%;
    }
    .lyrics-lyricsContainer-LyricsContainer .lyrics-lyricsContainer-LyricsLine {
        padding: 15px;
        filter: blur(1.5px);
        font-size: 210%;
    }`;

    let bubbleUI = `
    /* bubble UI */
    :root {
        --spice-sidebar: var(--spice-main) !important;
    }
    .main-nowPlayingBar-center .x-progressBar-progressBarBg .x-progressBar-sliderArea {
        border-radius: 10px !important;
    }`;

    let hideSpotifyFullScreen = `
    /* hide spotify premium full screen */
    .control-button[aria-label="Full screen"] {
        display: none;
    }`;

    let hideMarketplace = `
    /* hide marketplace */
    .main-navBar-navBarItem[data-id="/marketplace"] {
        display: none;
    }`;

    let darkSideBar = `
    /* Dark SideBar */
    :root {
        --spice-sidebar: var(--spice-main) !important;
    }`;

    let hideOverlay = `
    /* Hide Overlay */
    .GenericModal__overlay {
        background-color: transparent;
    }`;

    function customFont(url, name) {
        let customFont = `
        /* Better Font (Quicksand) */
        @import url("${url}");
        * {
            font-family: "${name}", sans-serif, serif !important;
        }`;

        return customFont;
    }

    function hideWindowsControlsCSS() {
        let hideWindowsControlsHeight = windowsControlsValues.hideWindowsControlsHeight;
        let hideWindowsControlsWidth = windowsControlsValues.hideWindowsControlsWidth;
        let hideWindowsControlsFilter = windowsControlsValues.hideWindowsControlsFilter;

        let color = isNewUI ? "var(--spice-sidebar)" : "var(--spice-main)";

        let hideWindowsControlsCSS = `
        #nord--hideWindowsControls {
            height: ${hideWindowsControlsHeight}px;
            width: ${hideWindowsControlsWidth}px;
            background-color: ${color};
            position: absolute;
            filter: brightness(${hideWindowsControlsFilter});
            top: 0px;
            right: 0px;
        }`;

        return hideWindowsControlsCSS;
    }

    ////////////////////////////////////// JS Snippets ///////////////////////////////////////////

    function quickSearchKeyBind() {
        changeKeyBind({ key: "k", ctrl: true }, { key: "space", ctrl: true }, CONFIG.quickSearch);
    }

    function searchKeyBind() {
        changeKeyBind({ key: "l", ctrl: true }, { key: "/", ctrl: true }, CONFIG.search);
    }

    async function redoKeyBind() {
        if (os("Win")) {
            if (CONFIG.redo) {
                Spicetify.Mousetrap.bind("ctrl+shift+z", async () => {
                    await Spicetify.CosmosAsync.post("sp://desktop/v1/redo");
                });
            } else {
                Spicetify.Mousetrap.unbind("ctrl+shift+z");
            }
        }
    }

    ////////////////////////////////////// UI ///////////////////////////////////////////

    let settingsMenuCSS = React.createElement(
        "style",
        null,
        `.popup-row::after {
                    content: "";
                    display: table;
                    clear: both;
                }
                .popup-row .col {
                    display: flex;
                    padding: 10px 0;
                    align-items: center;
                }
                .popup-row .col.description {
                    float: left;
                    padding-right: 15px;
                }
                .popup-row .col.action {
                    float: right;
                    text-align: right;
                }
                .popup-row .div-title {
                    color: var(--spice-text);
                }                
                .popup-row .divider {
                    height: 2px;
                    border-width: 0;
                    background-color: var(--spice-button-disabled);
                }
                .popup-row .space {
                    margin-bottom: 20px;
                    visibility: hidden;
                }
                .popup-row .info {
                    /* font-size: 13px; */
                }
                .popup-row .red {
                    font-size: 13px;
                    color: #59CE8F;
                }
                .popup-row .little-space {
                    margin-bottom: 10px;
                }
                .popup-row .inputbox {
                    display: flex;
                    flex-direction: column;
                    padding: 15px;
                    border-radius: 15px;
                    border: 0;
                    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.06);
                }
                button.checkbox {
                    align-items: center;
                    color: var(--spice-text);
                    cursor: pointer;
                    display: flex;
                    margin-inline-start: 12px;
                }
                button.checkbox.disabled {
                    color: rgba(var(--spice-rgb-text), 0.3);
                }
                select {
                    color: var(--spice-text);
                    background: rgba(var(--spice-rgb-shadow), 0.7);
                    border: 0;
                    height: 32px;
                }
                ::-webkit-scrollbar {
                    width: 8px;
                }
                .login-button {
                    background-color: var(--spice-button);
                    border-radius: 8px;
                    border-style: none;
                    color: var(--spice-text);
                    cursor: pointer;
                    font-size: 14px;
                    height: 40px;
                    margin: 10px;
                    padding: 5px 10px;
                    text-align: center;
                }
                .green {
                    background-color: #76ba99;
                    color: #25316D;
                }
                .red {
                    background-color: #A9555E;
                }
                input.small-input {
                    padding: 5px !important;
                    border-radius: 6px !important;
                    right: 0px !important;
                }
                .small-button {
                    margin-right: 20px;
                }`
    );

    function DisplayIcon({ icon, size }) {
        return React.createElement("svg", {
            width: size,
            height: size,
            viewBox: "0 0 16 16",
            fill: "currentColor",
            dangerouslySetInnerHTML: {
                __html: icon,
            },
        });
    }

    function checkBoxItem({ name, field, bool = true, check = true, more = false, onClickCheckFun = () => {}, onClickMoreFun = () => {} }) {
        if (bool) {
            let [value, setValue] = useState(CONFIG[field]);
            return React.createElement(
                "div",
                { className: "popup-row" },
                React.createElement("label", { className: "col description" }, name),
                React.createElement(
                    "div",
                    { className: "col action" },
                    more
                        ? React.createElement(
                              "button",
                              {
                                  className: "checkbox" + (value ? "" : " disabled"),
                                  onClick: async () => {
                                      onClickMoreFun();
                                  },
                              },
                              React.createElement(DisplayIcon, { icon: Spicetify.SVGIcons.more, size: 16 })
                          )
                        : null,
                    check
                        ? React.createElement(
                              "button",
                              {
                                  className: "checkbox" + (value ? "" : " disabled"),
                                  onClick: async () => {
                                      let state = !value;
                                      CONFIG[field] = state;
                                      setValue(state);
                                      await saveConfig();
                                      onClickCheckFun();
                                  },
                              },
                              React.createElement(DisplayIcon, { icon: Spicetify.SVGIcons.check, size: 16 })
                          )
                        : null
                )
            );
        } else {
            return null;
        }
    }

    function inputBoxItem({ name, field, bool = true, onChangeFun = () => {} }) {
        if (bool) {
            return React.createElement(
                "div",
                { className: "popup-row" },
                React.createElement("label", { className: "col description" }, name),
                React.createElement(
                    "div",
                    { className: "col action" },
                    React.createElement("input", {
                        className: "small-input",
                        placeholder: CONFIG[field],
                        required: true,
                        onChange: async (e) => {
                            onChangeFun(field, e.target.value);
                        },
                    })
                )
            );
        } else {
            return null;
        }
    }

    function heading({ name, bool = true }) {
        if (bool) {
            return React.createElement(
                "div",
                null,
                React.createElement("div", { className: "popup-row" }, React.createElement("hr", { className: "space" }, null)),
                React.createElement("div", { className: "popup-row" }, React.createElement("h3", { className: "div-title" }, name)),
                React.createElement("div", { className: "popup-row" }, React.createElement("hr", { className: "divider" }, null))
            );
        } else {
            return null;
        }
    }

    function ButtonItem({ name, color = "", onclickFun, onContextMenuFun }) {
        return React.createElement(
            "button",
            {
                className: `login-button${color}`,
                onClick: async () => {
                    onclickFun();
                },
                onContextMenu: async () => {
                    onContextMenuFun();
                },
            },
            name
        );
    }

    function editHideWindowsControls() {
        injectCSS(hideOverlay, "nord--hideOverlay");

        let editHideWindowsControlsContainer = React.createElement(
            "div",
            null,
            settingsMenuCSS,
            React.createElement(
                "div",
                { className: "popup-row" },
                React.createElement("p", { className: "popup-row" }, "Tutorial"),
                React.createElement("div", { className: "popup-row" }, React.createElement("hr", { className: "divider" }, null)),
                React.createElement("p", { className: "popup-row" }, `1. First Edit Height and Width`),
                React.createElement("p", { className: "popup-row" }, `2. After the Height and Width are perfect, Now try adjusting Filter`),
                React.createElement("div", { className: "popup-row little-space" }, null),
                React.createElement("div", { className: "popup-row" }, React.createElement("hr", { className: "divider" }, null)),
                React.createElement(inputBoxItem, {
                    name: "Height",
                    field: "hideWindowsControlsHeight",
                    onChangeFun: updateWindowsControls,
                }),
                React.createElement(inputBoxItem, {
                    name: "Width",
                    field: "hideWindowsControlsWidth",
                    onChangeFun: updateWindowsControls,
                }),
                React.createElement(inputBoxItem, {
                    name: "Filter ( Adjusts Color )",
                    field: "hideWindowsControlsFilter",
                    onChangeFun: updateWindowsControls,
                })
            ),
            React.createElement("div", { className: "popup-row" }, React.createElement("hr", { className: "space" }, null)),
            React.createElement(
                "button",
                {
                    className: "small-button green",
                    onClick: async () => {
                        CONFIG.hideWindowsControlsHeight = windowsControlsValues.hideWindowsControlsHeight;
                        CONFIG.hideWindowsControlsWidth = windowsControlsValues.hideWindowsControlsWidth;
                        CONFIG.hideWindowsControlsFilter = windowsControlsValues.hideWindowsControlsFilter;
                        await saveConfig();
                        Spicetify.PopupModal.hide();
                        reload();
                    },
                },
                `Save`
            ),
            React.createElement(
                "button",
                {
                    className: "small-button red",
                    onClick: async () => {
                        CONFIG.hideWindowsControlsHeight = "31";
                        CONFIG.hideWindowsControlsWidth = "135";
                        CONFIG.hideWindowsControlsFilter = "2.13";
                        await saveConfig();
                        Spicetify.PopupModal.hide();
                        reload();
                    },
                },
                `Reset`
            )
        );

        Spicetify.PopupModal.display({
            title: "Edit Windows Controls",
            content: editHideWindowsControlsContainer,
        });

        waitForUserToTriggerClosePopup();
    }

    function customFontInfo() {
        let customFontInfoContainer = React.createElement(
            "div",
            null,
            settingsMenuCSS,
            React.createElement(
                "div",
                { className: "popup-row" },
                React.createElement("p", { className: "popup-row" }, "If you dont have the font locally, then enter the Font's URL"),
                React.createElement("div", { className: "popup-row" }, React.createElement("hr", { className: "space" }, null)),
                React.createElement(inputBoxItem, {
                    name: "Font Url",
                    field: "customFontURL",
                }),
                React.createElement(inputBoxItem, {
                    name: "Font Name",
                    field: "customFontName",
                })
            ),
            React.createElement("div", { className: "popup-row" }, React.createElement("hr", { className: "space" }, null)),
            React.createElement(
                "button",
                {
                    className: "small-button green",
                    onClick: async () => {
                        let values = document.querySelectorAll(".popup-row .small-input");
                        let customFontURL = values[0].value;
                        let customFontName = values[1].value;

                        CONFIG.customFontURL = customFontURL;
                        CONFIG.customFontName = customFontName;
                        await saveConfig();
                        Spicetify.PopupModal.hide();
                        reload();
                    },
                },
                `Save`
            ),
            React.createElement(
                "button",
                {
                    className: "small-button red",
                    onClick: async () => {
                        CONFIG.customFontURL = "https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap";
                        CONFIG.customFontName = "Quicksand";
                        await saveConfig();
                        Spicetify.PopupModal.hide();
                        reload();
                    },
                },
                `Reset`
            )
        );

        Spicetify.PopupModal.display({
            title: "Custom Font",
            content: customFontInfoContainer,
        });

        waitForUserToTriggerClosePopup();
    }

    let settingsDOMContent = React.createElement(
        "div",
        null,
        settingsMenuCSS,
        React.createElement("div", { className: "popup-row" }, React.createElement("h3", { className: "div-title" }, "Settings")),
        React.createElement("div", { className: "popup-row" }, React.createElement("hr", { className: "divider" }, null)),
        React.createElement(checkBoxItem, {
            name: "Custom Font",
            field: "customFont",
            more: true,
            onClickMoreFun: async () => {
                Spicetify.PopupModal.hide();
                setTimeout(customFontInfo, 300);
            },
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Windows Control",
            field: "hideWindowsControls",
            bool: os("Win"),
            more: true,
            onClickMoreFun: async () => {
                Spicetify.PopupModal.hide();
                setTimeout(editHideWindowsControls, 300);
            },
        }),
        React.createElement(checkBoxItem, {
            name: "Pointers",
            field: "pointers",
        }),
        React.createElement(heading, {
            name: "Home",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Home Page Recommendation",
            field: "hideHomePageRecommendation",
        }),
        React.createElement(heading, {
            name: "SideBar",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Marketplace",
            field: "hideMarketplace",
        }),
        React.createElement(checkBoxItem, {
            name: "Dark SideBar",
            field: "darkSideBar",
            bool: !isNewUI,
        }),
        React.createElement(checkBoxItem, {
            name: "Hide SideBar ScrollBar",
            field: "hideSideBarScrollBar",
        }),
        React.createElement(checkBoxItem, {
            name: "Highlight SideBar Selected Items (Main Items)",
            field: "highlightSideBarItem",
        }),
        React.createElement(checkBoxItem, {
            name: "Highlight SideBar Items (Playlists)",
            field: "highlightSideBarSelectedItem",
        }),
        React.createElement(checkBoxItem, {
            name: "SideBar Playlist Names bold",
            field: "boldedSideBarItems",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide SideBar Divider",
            field: "hideSideBarDivider",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide SideBar Status",
            field: "hideSideBarStatus",
        }),
        React.createElement(heading, {
            name: "Player",
        }),
        React.createElement(checkBoxItem, {
            name: "Right Side Cover Art",
            field: "rightSideCoverArt",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Friend Activity",
            field: "hideFriendActivity",
            bool: isNewUI,
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Spotify Connect",
            field: "hideSpotifyConnect",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Spotify Full Screen",
            field: "hideSpotifyFullScreen",
            bool: isPremium,
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Dots Under Player Controls",
            field: "hideDotsUnderPlayerButtons",
        }),
        React.createElement(heading, {
            name: "Playlist",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Playlist Similar Songs Recommendation",
            field: "hideSimilarSongsRecommendation",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Current Playing Song BG",
            field: "hideCurrentPlayingSongBG",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Playlist Image Edit Button",
            field: "hidePlaylistImageEditButton",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Radio Gradient",
            field: "hideRadioGradient",
        }),
        React.createElement(heading, {
            name: "Your Library",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Your Library Liked Song's Card",
            field: "hideLikedSongsCard",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Your Library Liked Song's Card Text",
            field: "hideLikedSongsCardTexts",
        }),
        React.createElement(heading, {
            name: "Misc",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Ads",
            field: "hideAds",
            bool: !isPremium,
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Top Gradient",
            field: "hideTopGradient",
        }),
        React.createElement(checkBoxItem, {
            name: "Norded Genre Cards",
            field: "betterGenre",
        }),
        React.createElement(checkBoxItem, {
            name: "Big Artist Image",
            field: "artistBigImage",
        }),
        React.createElement(checkBoxItem, {
            name: "Norded Spotify Lyrics",
            field: "nordLyrics",
        }),
        React.createElement(checkBoxItem, {
            name: "Beautify Spotify Lyrics",
            field: "betterSpotifyLyrics",
        }),
        React.createElement(checkBoxItem, {
            name: "Beautify Lyrics Plus",
            field: "betterLyricsPlus",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide TopBar Play Button",
            field: "hideTopBarPlayButton",
        }),
        React.createElement(checkBoxItem, {
            name: "Hide Cards Download Status",
            field: "hideCardsDownloadStatus",
        }),
        React.createElement(checkBoxItem, {
            name: "Bubble UI",
            field: "bubbleUI",
            bool: isNewUI,
        }),
        React.createElement(heading, {
            name: "Keybinds",
        }),
        React.createElement(checkBoxItem, {
            name: "Quick Search ( Ctrl + Space )",
            field: "quickSearch",
        }),
        React.createElement(checkBoxItem, {
            name: "Search ( Ctrl + / )",
            field: "search",
        }),
        React.createElement(checkBoxItem, {
            name: "Redo ( Ctrl + Shift + z )",
            field: "redo",
            bool: os("Win"),
        }),
        React.createElement(heading, {
            name: "Developer Settings",
            bool: CONFIG.dev && !isMarketplace,
        }),
        React.createElement(checkBoxItem, {
            name: "Use Local CSS",
            field: "localCSS",
            bool: CONFIG.dev && !isMarketplace,
            onclickFun: async () => {
                reload();
            },
        }),
        React.createElement(checkBoxItem, {
            name: "Right Click Nord Spotify Settings Icon to Refresh",
            field: "reload",
            bool: CONFIG.dev && !isMarketplace,
        }),
        React.createElement(ButtonItem, {
            name: "Like on GitHub 👍",
            onclickFun: () => {
                window.open("https://github.com/Tetrax-10/Nord-Spotify");
            },
            onContextMenuFun: async () => {
                if (!isMarketplace) {
                    CONFIG.dev = !CONFIG.dev;
                    await saveConfig();
                    reload();
                }
            },
        }),
        React.createElement(ButtonItem, {
            name: "Reset Settings",
            color: " red",
            onclickFun: async () => {
                CONFIG = defaultSettings;
                await saveConfig();
                reload();
            },
        })
    );

    function settingsPage() {
        Spicetify.PopupModal.display({
            title: "Nord Spotify",
            content: settingsDOMContent,
            isLarge: true,
        });
    }

    ////////////////////////////////////// Menu ///////////////////////////////////////////

    let svg = `<svg viewBox="0 0 262.394 262.394" style="scale: 0.5; fill: var(--spice-custom-subdued)"><path d="M245.63,103.39h-9.91c-2.486-9.371-6.197-18.242-10.955-26.432l7.015-7.015c6.546-6.546,6.546-17.159,0-23.705 l-15.621-15.621c-6.546-6.546-17.159-6.546-23.705,0l-7.015,7.015c-8.19-4.758-17.061-8.468-26.432-10.955v-9.914 C159.007,7.505,151.502,0,142.244,0h-22.091c-9.258,0-16.763,7.505-16.763,16.763v9.914c-9.37,2.486-18.242,6.197-26.431,10.954 l-7.016-7.015c-6.546-6.546-17.159-6.546-23.705,0.001L30.618,46.238c-6.546,6.546-6.546,17.159,0,23.705l7.014,7.014 c-4.758,8.19-8.469,17.062-10.955,26.433h-9.914c-9.257,0-16.762,7.505-16.762,16.763v22.09c0,9.258,7.505,16.763,16.762,16.763 h9.914c2.487,9.371,6.198,18.243,10.956,26.433l-7.015,7.015c-6.546,6.546-6.546,17.159,0,23.705l15.621,15.621 c6.546,6.546,17.159,6.546,23.705,0l7.016-7.016c8.189,4.758,17.061,8.469,26.431,10.955v9.913c0,9.258,7.505,16.763,16.763,16.763 h22.091c9.258,0,16.763-7.505,16.763-16.763v-9.913c9.371-2.487,18.242-6.198,26.432-10.956l7.016,7.017 c6.546,6.546,17.159,6.546,23.705,0l15.621-15.621c3.145-3.144,4.91-7.407,4.91-11.853s-1.766-8.709-4.91-11.853l-7.016-7.016 c4.758-8.189,8.468-17.062,10.955-26.432h9.91c9.258,0,16.763-7.505,16.763-16.763v-22.09 C262.393,110.895,254.888,103.39,245.63,103.39z M131.198,191.194c-33.083,0-59.998-26.915-59.998-59.997 c0-33.083,26.915-59.998,59.998-59.998s59.998,26.915,59.998,59.998C191.196,164.279,164.281,191.194,131.198,191.194z"/><path d="M131.198,101.199c-16.541,0-29.998,13.457-29.998,29.998c0,16.54,13.457,29.997,29.998,29.997s29.998-13.457,29.998-29.997 C161.196,114.656,147.739,101.199,131.198,101.199z"/></svg>`;

    new Spicetify.Topbar.Button("Nord Spotify", svg, settingsPage);

    ////////////////////////////////////// Functions ///////////////////////////////////////////

    function injectCSS(cssStyle, id) {
        if (!body.classList.contains(id)) {
            let styleElement = document.createElement("style");
            styleElement.id = id;
            styleElement.innerHTML = cssStyle;
            body.appendChild(styleElement);
            body.classList.add(id);
        }
    }

    function injectStyleSheet(src, id) {
        if (!body.classList.contains(id)) {
            let styleSheet = document.createElement("link");
            styleSheet.id = id;
            styleSheet.rel = "stylesheet";
            styleSheet.type = "text/css";
            styleSheet.href = src;
            body.appendChild(styleSheet);
            body.classList.add(id);
        }
    }

    function removeInjectedElement(id) {
        let element = document.getElementById(id);
        if (body.classList.contains(id) && element) {
            element.remove();
            body.classList.remove(id);
        }
    }

    function injectJS(callback = () => {}) {
        callback();
    }

    function cssSnippet(data, id, bool) {
        if (bool) {
            injectCSS(data, id);
        } else {
            removeInjectedElement(id);
        }
    }

    async function dynamicUI(newUICode, newID, oldUICode, oldID, bool) {
        if (isNewUI) {
            cssSnippet(newUICode, newID, bool);
        } else {
            cssSnippet(oldUICode, oldID, bool);
        }
    }

    function countNoOfSlashes(string) {
        let count = 0;
        string.split("").forEach((char) => {
            if (char == "/") {
                count++;
            }
        });
        return count;
    }

    function changeKeyBind(oldKey, newKey, bool) {
        try {
            if (bool) {
                Spicetify.Keyboard.changeShortcut(oldKey, newKey);
            } else {
                Spicetify.Keyboard.changeShortcut(newKey, oldKey);
            }
        } catch {}
    }

    function os(os) {
        return versionInfo.platform.includes(os);
    }

    async function isNewUIFunc() {
        return (await waitForElement(".nav-alt", 500)) ? true : false;
    }

    async function isPremiumFunc() {
        let data = await Spicetify.CosmosAsync.get("sp://product-state/v1/values");
        if (data.catalogue == "premium" || data.name == "Spotify Premium" || data.type == "premium") {
            return true;
        } else {
            return false;
        }
    }

    function injectReload(bool) {
        if (bool) {
            settingsButton.addEventListener("contextmenu", reload);
        } else {
            settingsButton.removeEventListener("contextmenu", reload);
        }
    }

    async function waitForUserToTriggerClosePopup() {
        const closeButton = await waitForElement("body > generic-modal button.main-trackCreditsModal-closeBtn", 1000);
        const modalOverlay = await waitForElement("body > generic-modal > div", 1000);
        if (closeButton && modalOverlay) {
            closeButton.onclick = () => reload();
            modalOverlay.onclick = (e) => {
                if (e.target === modalOverlay) {
                    reload();
                }
            };
        }
    }

    async function waitForElement(selector, timeout, location = document.body) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(async () => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                } else {
                    async function timeOver() {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                observer.disconnect();
                                resolve(false);
                            }, timeout);
                        });
                    }
                    resolve(await timeOver());
                }
            });

            observer.observe(location, {
                childList: true,
                subtree: true,
            });
        });
    }

    function reload() {
        Spicetify.PopupModal.hide();
        location.reload();
    }

    function hideWindowsControls(id = "nord--hideWindowsControls") {
        let element = document.createElement("div");
        element.id = id;
        body.appendChild(element);
        body.classList.add(id);
    }

    async function updateWindowsControls(field, value) {
        windowsControlsValues[field] = value;
        removeInjectedElement("nord--hideWindowsControlsCSS");
        cssSnippet(hideWindowsControlsCSS(), "nord--hideWindowsControlsCSS", CONFIG.hideWindowsControls);
    }

    ////////////////////////////////////// Main ///////////////////////////////////////////

    let data = Spicetify.Platform.History.location;

    if ((data.pathname.includes("/artist/") || data.pathname.includes("/playlist/")) && countNoOfSlashes(data.pathname) == 2) {
        await dynamicUI(hideArtistTopBarNew, "nord--hideArtistTopBarNew", hideArtistTopBarOld, "nord--hideArtistTopBarOld", true);
    } else {
        removeInjectedElement("nord--hideArtistTopBarNew");
        removeInjectedElement("nord--hideArtistTopBarOld");
    }

    Spicetify.Platform.History.listen(async (data) => {
        if ((data.pathname.includes("/artist/") || data.pathname.includes("/playlist/")) && countNoOfSlashes(data.pathname) == 2) {
            await dynamicUI(hideArtistTopBarNew, "nord--hideArtistTopBarNew", hideArtistTopBarOld, "nord--hideArtistTopBarOld", true);
        } else {
            removeInjectedElement("nord--hideArtistTopBarNew");
            removeInjectedElement("nord--hideArtistTopBarOld");
        }
    });

    cssSnippet(customFont(CONFIG.customFontURL, CONFIG.customFontName), "nord-customFont", CONFIG.customFont);

    cssSnippet(hideHomePageRecommendation, "nord--hideHomePageRecommendation", CONFIG.hideHomePageRecommendation);

    cssSnippet(hideSideBarScrollBar, "nord--hideSideBarScrollBar", CONFIG.hideSideBarScrollBar);

    cssSnippet(highlightSideBarItem, "nord--highlightSideBarItem", CONFIG.highlightSideBarItem);

    cssSnippet(highlightSideBarSelectedItem, "nord--highlightSideBarSelectedItem", CONFIG.highlightSideBarSelectedItem);

    cssSnippet(boldedSideBarItems, "nord--boldedSideBarItems", CONFIG.boldedSideBarItems);

    cssSnippet(hideSideBarDivider, "nord--hideSideBarDivider", CONFIG.hideSideBarDivider);

    cssSnippet(hideSideBarStatus, "nord--hideSideBarStatus", CONFIG.hideSideBarStatus);

    await dynamicUI(rightSideCoverArtNew, "nord--rightSideCoverArt", rightSideCoverArtOld, "nord--rightSideCoverArt", CONFIG.rightSideCoverArt);

    cssSnippet(leftSideCoverArt, "nord--leftSideCoverArt", CONFIG.leftSideCoverArt);

    await dynamicUI(hideFriendActivity, "nord--hideFriendActivity", null, null, CONFIG.hideFriendActivity);

    cssSnippet(hideSpotifyConnect, "nord--hideSpotifyConnect", CONFIG.hideSpotifyConnect);

    cssSnippet(hideSpotifyFullScreen, "nord--hideSpotifyFullScreen", CONFIG.hideSpotifyFullScreen);

    cssSnippet(hideDotsUnderPlayerButtons, "nord--hideDotsUnderPlayerButtons", CONFIG.hideDotsUnderPlayerButtons);

    cssSnippet(hideSimilarSongsRecommendation, "nord--hideSimilarSongsRecommendation", CONFIG.hideSimilarSongsRecommendation);

    cssSnippet(hideCurrentPlayingSongBG, "nord--hideCurrentPlayingSongBG", !CONFIG.hideCurrentPlayingSongBG);

    cssSnippet(hidePlaylistImageEditButton, "nord--hidePlaylistImageEditButton", CONFIG.hidePlaylistImageEditButton);

    cssSnippet(hideRadioGradient, "nord--hideRadioGradient", CONFIG.hideRadioGradient);

    cssSnippet(hideLikedSongsCard, "nord--hideLikedSongsCard", CONFIG.hideLikedSongsCard);

    cssSnippet(hideLikedSongsCardTexts, "nord--hideLikedSongsCardTexts", CONFIG.hideLikedSongsCardTexts);

    cssSnippet(hideAds, "nord--hideAds", CONFIG.hideAds);

    cssSnippet(hideTopGradient, "nord--hideTopGradient", CONFIG.hideTopGradient);

    cssSnippet(betterGenre, "nord--betterGenre", CONFIG.betterGenre);

    cssSnippet(artistBigImage, "nord--artistBigImage", CONFIG.artistBigImage);
    await dynamicUI(artistBigImageNew, "nord--artistBigImageNew", artistBigImageOld, "nord--artistBigImageOld", CONFIG.artistBigImage);

    cssSnippet(pointers, "nord--pointers", CONFIG.pointers);

    cssSnippet(nordLyrics, "nord--nordLyrics", CONFIG.nordLyrics);

    cssSnippet(betterSpotifyLyrics, "nord--betterSpotifyLyrics", CONFIG.betterSpotifyLyrics);

    cssSnippet(betterLyricsPlus, "nord--betterLyricsPlus", CONFIG.betterLyricsPlus);

    cssSnippet(hideTopBarPlayButton, "nord--hideTopBarPlayButton", CONFIG.hideTopBarPlayButton);

    cssSnippet(hideCardsDownloadStatus, "nord--hideCardsDownloadStatus", CONFIG.hideCardsDownloadStatus);

    cssSnippet(bubbleUI, "nord--bubbleUI", !CONFIG.bubbleUI);

    cssSnippet(hideMarketplace, "nord--hideMarketplace", CONFIG.hideMarketplace);

    injectJS(quickSearchKeyBind);

    injectJS(searchKeyBind);

    injectJS(redoKeyBind);

    await dynamicUI(null, null, darkSideBar, "nord--darkSideBar", !CONFIG.darkSideBar);

    hideWindowsControls(); // injects div
    cssSnippet(hideWindowsControlsCSS(), "nord--hideWindowsControlsCSS", CONFIG.hideWindowsControls); // injects css for the above div

    let settingsButton = await waitForElement(`.main-topBar-button[title="Nord Spotify"]`, 5000);

    injectReload(CONFIG.dev && CONFIG.reload);

    settingsButton.addEventListener("click", waitForUserToTriggerClosePopup);
}
