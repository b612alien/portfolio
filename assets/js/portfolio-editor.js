const form = document.getElementById('editor');
const result = document.getElementById('result');
const categories = {commercial:{ko:'커머셜 주얼리',en:'Commercial Jewelry'},fine:{ko:'파인 주얼리',en:'Fine Jewelry'},wedding:{ko:'웨딩',en:'Wedding'},competition:{ko:'공모전',en:'Competitions'},experimental:{ko:'실험적 주얼리',en:'Experimental Jewelry'}};
const bilingual = (element, ko, en) => {
  element.removeAttribute('data-i18n');
  element.dataset.ko = ko;
  element.dataset.en = en;
  element.textContent = ko;
};
const download = (name, content) => {
  const url = URL.createObjectURL(new Blob([content], {type:'text/html;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
form.addEventListener('submit', async event => {
  event.preventDefault();
  const fields = Object.fromEntries(new FormData(form));
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    const response = await fetch('../works/collection-01/index.html');
    if (!response.ok) throw new Error('템플릿을 불러오지 못했습니다.');
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    const category = categories[fields.category];
    doc.title = fields.titleKo + ' — HISONG JEONG';
    bilingual(doc.querySelector('h1'), fields.titleKo, fields.titleEn);
    bilingual(doc.querySelector('.page-title p'), fields.summaryKo, fields.summaryEn);
    bilingual(doc.querySelector('.page-title .eyebrow'), category.ko, category.en);
    const paragraphs = doc.querySelectorAll('.info-grid .content > p');
    bilingual(paragraphs[0], fields.overviewKo, fields.overviewEn);
    bilingual(paragraphs[1], fields.processKo, fields.processEn);
    paragraphs.forEach(p => { p.style.whiteSpace = 'pre-line'; });
    doc.querySelector('.project-hero').textContent = fields.titleKo;
    bilingual(doc.querySelector('.project-hero'), fields.titleKo, fields.titleEn);
    const card = document.createElement('a');
    card.className = 'work-card'; card.dataset.category = fields.category;
    card.href = fields.slug + '/';
    card.innerHTML = '<div class="visual"><span class="mark"></span></div><div class="card-meta"><span></span><span></span></div><div class="card-sub"></div>';
    card.querySelector('.mark').textContent = fields.year;
    bilingual(card.querySelector('.card-meta span'), fields.titleKo, fields.titleEn);
    card.querySelector('.card-meta span:last-child').textContent = fields.year;
    bilingual(card.querySelector('.card-sub'), category.ko, category.en);
    download('index.html', '<!doctype html>\n' + doc.documentElement.outerHTML);
    download(fields.slug + '-card.html', '<!-- Paste inside .grid in works/index.html -->\n' + card.outerHTML);
    result.textContent = 'index.html을 works/' + fields.slug + '/index.html에 저장하세요. 카드 파일의 a 태그를 works/index.html의 .grid에 추가하고 전체 작품 수를 갱신하세요. 이미지 자리표시자는 실제 작업 이미지로 교체하세요. 브라우저가 추가 다운로드를 차단하면 다운로드 허용 후 다시 실행해 주세요.';
  } catch (error) {
    result.textContent = error.message + ' VS Code Live Server로 이 입력 페이지를 열어 주세요.';
  } finally { button.disabled = false; }
});
