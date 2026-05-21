import Script from 'next/script';
import { getSeoDefaults } from '@/lib/queries';

/**
 * Injects Google Analytics 4 and/or Google Tag Manager using the IDs
 * configured at /admin/seo. Renders nothing when neither is set, so dev and
 * un-configured deployments stay clean.
 */
export async function SiteAnalytics() {
  let gaId = '';
  let gtmId = '';
  try {
    const seo = await getSeoDefaults();
    gaId = seo.gaMeasurementId;
    gtmId = seo.gtmId;
  } catch {
    // DB unavailable (build sandbox) — skip analytics.
  }

  if (!gaId && !gtmId) return null;

  return (
    <>
      {gtmId ? (
        <>
          <Script id="gtm-loader" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="gtm"
            />
          </noscript>
        </>
      ) : null}

      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
