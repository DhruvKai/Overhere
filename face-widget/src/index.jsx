// The camera part of the live face check, built into ../face-widget.js (see face-widget/README.md).
// demo.html calls window.OverhereFaceWidget.run(element, { sessionId, region, credentials }) with what the
// face-start Edge Function returned. The promise resolves once AWS has analysed the video; face-result then
// fetches the verdict on the server. Nothing here decides whether the check passed.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FaceLivenessDetectorCore } from '@aws-amplify/ui-react-liveness';
import '@aws-amplify/ui-react/styles.css';

window.OverhereFaceWidget = {
  run(el, { sessionId, region, credentials }) {
    return new Promise((resolve, reject) => {
      if (!el) return reject(new Error('The face check could not start.'));
      const root = createRoot(el);
      let settled = false;
      const finish = (fn, v) => { if (settled) return; settled = true; setTimeout(() => root.unmount(), 0); fn(v); };
      root.render(
        <FaceLivenessDetectorCore
          sessionId={sessionId}
          region={region}
          disableStartScreen={false}
          config={{
            // temporary credentials from face-start: they can only stream video to a liveness session
            credentialProvider: async () => ({
              accessKeyId: credentials.accessKeyId,
              secretAccessKey: credentials.secretAccessKey,
              sessionToken: credentials.sessionToken,
              expiration: new Date(credentials.expiration),
            }),
          }}
          onAnalysisComplete={async () => finish(resolve)}
          onUserCancel={() => finish(reject, new Error('Face check cancelled.'))}
          onError={(e) => finish(reject, new Error(
            e?.state === 'CAMERA_ACCESS_ERROR' ? 'Please allow camera access and try again.'
              : e?.state === 'TIMEOUT' ? 'That took too long. Please try again.'
              : 'The face check stopped. Please try again, in good light.'))}
        />,
      );
    });
  },
};
