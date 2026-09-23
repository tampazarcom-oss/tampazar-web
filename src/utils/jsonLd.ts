/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function injectJsonLd(data: object) {
  let script = document.getElementById('tampazar-jsonld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'tampazar-jsonld';
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
