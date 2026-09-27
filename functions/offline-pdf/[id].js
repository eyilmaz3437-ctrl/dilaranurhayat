const BOOKS = {
  'edebiyat': 'https://tymm.meb.gov.tr/assets/pdf/turk-dili-ve-edebiyati-9sinif-ders-kitabi_20260908_185914_237.pdf',
  'matematik-1': 'https://tymm.meb.gov.tr/assets/pdf/matematik-9sinif-ders-kitabi-1kitap_20260908_111051_343.pdf',
  'matematik-2': 'https://tymm.meb.gov.tr/assets/pdf/matematik-9sinif-ders-kitabi-2kitap_20260908_111224_539.pdf',
  'fizik': 'https://tymm.meb.gov.tr/assets/pdf/fizik-dersi-9-sinif-ders-kitabi.pdf',
  'kimya': 'https://tymm.meb.gov.tr/assets/pdf/kimya-9sinif-ders-kitabi_20260908_105401_981.pdf',
  'biyoloji': 'https://tymm.meb.gov.tr/assets/pdf/biyoloji-9-sinif-ders-kitabi.pdf',
  'tarih': 'https://tymm.meb.gov.tr/assets/pdf/tarih-9sinif-ders-kitabi_20260908_184825_403.pdf',
  'cografya': 'https://tymm.meb.gov.tr/assets/pdf/cografya-dersi-sinif-9-ders-kitabi.pdf',
  'din': 'https://tymm.meb.gov.tr/assets/pdf/din-kulturu-ve-ahlak-bilgisi-9.pdf',
  'din-2026': 'https://tymm.meb.gov.tr/assets/pdf/din-kulturu-ve-ahlak-bilgisi-9.pdf',
  'din-2026-ogm-v2': 'https://tymm.meb.gov.tr/upload/kitap/ogm/din-kulturu-ve-ahlak-bilgisi-9.pdf',
  'ingilizce': 'https://tymm.meb.gov.tr/assets/pdf/ingilizce-dersi-9-sinif-ders-kitabi.pdf',
  'almanca': 'https://ogmmateryal.eba.gov.tr/panel/upload/kitap/lfwtr3fxahv.pdf',
};

function cleanId(raw='') {
  return String(raw).replace(/\.pdf$/i,'');
}

export async function onRequest(context) {
  const request = context.request;
  const id = cleanId(context.params.id);
  const source = BOOKS[id];

  if (!source) return new Response('Kitap bulunamadı', { status: 404 });

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405 });
  }

  const headers = new Headers({
    'Accept': 'application/pdf,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 DNH-Textbook-Proxy'
  });
  const range = request.headers.get('Range');
  if (range) headers.set('Range', range);

  let upstream;
  try {
    upstream = await fetch(source, {
      method: request.method === 'HEAD' ? 'HEAD' : 'GET',
      headers,
      redirect: 'follow'
    });
  } catch {
    return new Response('MEB PDF bağlantısına ulaşılamadı', { status: 502 });
  }

  const out = new Headers();
  for (const key of ['content-type','content-length','content-range','accept-ranges','etag','last-modified']) {
    const value = upstream.headers.get(key);
    if (value) out.set(key, value);
  }
  if (!out.get('content-type')) out.set('content-type','application/pdf');
  out.set('cache-control','public, max-age=86400');
  out.set('content-disposition', `inline; filename="${id}.pdf"`);
  out.set('x-dnh-book-id', id);

  return new Response(request.method === 'HEAD' ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out
  });
}
