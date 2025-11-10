// PostHog & Umami Analytics - Production Only
// This file is loaded by index.html to avoid inline scripts for CSP compliance

(function() {
    // Only initialize analytics on production domain
    const isProduction = window.location.hostname === 'vladbortnik.dev';
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:';

    if (isProduction || (!isLocalhost && window.location.protocol === 'https:')) {
        // PostHog Analytics Initialization
        !function (t, e) { var o, n, p, r; e.__SV || (window.posthog && window.posthog.__loaded) || (window.posthog = e, e._i = [], e.init = function (i, s, a) { function g(t, e) { var o = e.split("."); 2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } } (p = t.createElement("script")).type = "text/javascript", p.crossOrigin = "anonymous", p.async = !0, p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js", (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r); var u = e; for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function (t) { var e = "posthog"; return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e }, u.people.toString = function () { return u.toString(1) + ".people (stub)" }, o = "init hi $r kr ui wr Er capture Ri calculateEventProperties Ir register register_once register_for_session unregister unregister_for_session Fr getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Cr Tr createPersonProfile Or yr Mr opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Pr debug L Rr getPageViewId captureTraceFeedback captureTraceMetric gr".split(" "), n = 0; n < o.length; n++)g(u, o[n]); e._i.push([i, s, a]) }, e.__SV = 1) }(document, window.posthog || []);

        posthog.init('phc_PtXY59P30Ckark4eFmib3xrXlMd9H2eibBsFTd302Yv', {
            api_host: 'https://us.i.posthog.com',
            autocapture: true,
            capture_pageview: true,
            capture_pageleave: true,
            disable_session_recording: true,
            persistence: 'localStorage+cookie',
            person_profiles: 'identified_only'
        });

        // Umami Analytics Initialization
        const script = document.createElement('script');
        script.defer = true;
        script.src = 'https://analytics.vladbortnik.dev/script.js';
        script.setAttribute('data-website-id', 'b386b8f9-b644-4400-a091-208983cb8340');
        document.head.appendChild(script);
    } else {
        console.log('🚫 [Dev Mode] PostHog and Umami disabled on localhost');
    }
})();
