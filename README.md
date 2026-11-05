# HISONG JEONG — 정적 포트폴리오

폴더별 index.html을 사용하는 독립 HTML 사이트입니다. 프레임워크·빌드·서버 라우터가 필요하지 않습니다.

## 최종 구조

```text
/
|-- index.html
|-- works/
|   |-- index.html
|   |-- collection-01/index.html   (Form Study No. 01)
|   |-- collection-02/index.html   (Material & Memory)
|   |-- collection-03/index.html   (Fine Jewelry Study)
|-- research/index.html
|-- about/index.html
|-- contact/index.html
|-- assets/
|   |-- css/style.css
|   |-- js/main.js
|   |-- js/i18n.js
|   |-- js/translations.js
|   |-- js/redirect.js
|   |-- js/portfolio-editor.js
|   |-- images/.gitkeep
|-- tools/portfolio-editor.html
|-- scripts/verify.mjs
|-- README.md
|-- works.html, research.html, about.html, contact.html  (이전 주소 호환)
|-- projects/collection-01.html, collection-02.html, collection-03.html (이전 주소 호환)
```

## 로컬 실행

VS Code Live Server에서 프로젝트 루트를 열고 /, /works/, /works/collection-01/ 등에 접속하세요. 폴더 URL은 HTTP 서버로 확인합니다.

## 한국어·영어와 작품 입력

첫 방문은 한국어이며 헤더 KO/EN 버튼으로 전환합니다. 선택은 localStorage에 저장되어 다른 페이지에서도 유지됩니다. 저장소 사용이 차단되어도 현재 페이지 전환은 가능합니다. 기본 한국어 본문은 HTML에 들어 있어 JavaScript가 없어도 읽을 수 있습니다.

**입력 화면:** Live Server에서 tools/portfolio-editor.html을 여세요. 작품명·소개·설명·제작 과정을 한국어와 영어 각각 별도 입력합니다. 생성 버튼은 작품 index.html과 Works 카드 HTML을 다운로드합니다. 작품 파일을 works/입력한-폴더명/index.html로 저장하고 카드 코드를 works/index.html의 .grid 안에 붙여 넣으세요. All (03) 표기는 작품 수에 맞게 갱신하세요. 홈에도 카드를 넣으면 링크를 works/입력한-폴더명/으로 바꾸세요. 이미지 자리표시자는 실제 이미지로 교체합니다. 입력 도구는 서버에 저장하거나 자동 배포하지 않습니다. 기존 작품을 편집하려면 아래 데이터 또는 HTML을 수정하세요.

기존 공통 번역은 assets/js/translations.js에서 키별 ko/en을 함께 관리합니다. HTML의 data-i18n 키로 연결됩니다. 새 작품 문구는 HTML에 다음처럼 두 버전을 직접 입력해도 됩니다.

```html
<p data-ko="한국어 프로젝트 설명" data-en="English project description">한국어 프로젝트 설명</p>
```

번역 데이터의 HTML은 실행하지 않고 텍스트로 표시합니다. 기존 영문 작품 데이터 3개와 시각 요소를 유지하고 한국어 번역을 추가했습니다. 원본에는 실제 이미지 파일이나 언어 전환이 없었습니다. assets/images/는 향후 이미지용 빈 폴더입니다.

## 공통 코드와 경로

스타일은 assets/css/style.css, 메뉴·필터는 main.js, 언어 전환은 i18n.js에 있습니다. 정적 HTML 탐색을 유지하기 위해 작은 헤더·푸터 마크업은 페이지별로 유지합니다. 새 페이지는 기존 작품 페이지를 복사하면 상대 경로를 유지할 수 있습니다. 상단 로고가 Home 링크이고 aria-current로 현재 위치를 표시합니다. 작품 상세에서는 Works가 현재 영역입니다.

링크는 문서 위치 기준 상대 경로이고 폴더 주소는 /로 끝납니다. 루트와 /저장소명/에서 같은 파일을 사용합니다.

## 검증

Node.js 22.12 이상, 외부 패키지 없이 실행합니다.

```sh
node scripts/verify.mjs
node --check assets/js/main.js
node --check assets/js/i18n.js
node --check assets/js/translations.js
node --check assets/js/redirect.js
node --check assets/js/portfolio-editor.js
```

전체 로컬 href/src·fragment, 8개 본 페이지, 작품 카드, 현재 위치, 모바일 메뉴, 필터, 한영 전환·저장·저장 차단 시 동작, 이전 주소 이동을 검사합니다. 임시 HTTP 서버로 루트와 /repository-name/의 페이지·파일 응답을 검사한 후 종료합니다. 브라우저 실제 렌더링, 다운로드 UI, 외부 Google Fonts는 자동 검증 대상이 아닙니다.

## GitHub Pages와 이전 주소

저장소 루트를 Pages 소스로 사용합니다. 이번 작업에서는 Git 초기화·commit·push·배포·CNAME 설정을 하지 않았습니다. 현재 폴더에는 .git이 없어 이전 Git 변경 상태를 조회할 수 없었습니다.

기존 URL 7개는 새 주소로 연결하는 호환 HTML로 남겼습니다. JavaScript location.replace는 쿼리와 해시를 유지합니다. JavaScript 비활성 상태에서도 meta refresh와 수동 링크가 있습니다. 이 방식은 HTTP 301/308 응답은 아닙니다. 기존 북마크 유지를 위해 호환 파일도 함께 배포하세요.

개인 도메인은 GitHub Pages 설정과 DNS에서 hisongjeong.com을 연결하세요. 상대 링크 수정은 필요하지 않습니다. 입력 도구를 공개하고 싶지 않으면 배포 산출물에서 tools/와 portfolio-editor.js를 제외할 수 있습니다.

## Portfolio 하위 메뉴

Works 메뉴는 Portfolio로 변경했습니다. 기존 /works/ URL은 유지합니다. 데스크톱은 hover, 모바일은 옆 화살표로 네 분류를 펼칩니다. 분류 링크는 /works/?category=commercial, wedding, fine, competition으로 이동하고 해당 필터를 선택합니다. 기존 experimental 작품은 전체 및 실험 작업 필터에 그대로 남깁니다. 웨딩·공모전은 작품을 추가하기 전까지 빈 목록 안내가 표시됩니다. 작품 입력 화면에서도 웨딩·공모전을 선택할 수 있습니다.

## CV 타임라인 편집

상단 About은 CV로 바뀌었고 주소는 /about/을 유지합니다. Research는 메뉴에서 제외했지만 기존 페이지는 보존합니다. assets/js/cv-data.js의 배열에서 객체 하나가 타임라인 한 항목입니다. period(기간), title(제목), organization(기관), description(설명)에 ko/en을 각각 작성합니다. 객체를 복사해 추가하거나 통째로 삭제할 수 있고 배열 순서대로 표시됩니다. 현재 항목은 실제 경력을 가정하지 않은 준비 중 표시입니다. 스타일은 style.css의 CV 부분에서 관리합니다.

Portfolio 화살표는 제거했습니다. 데스크톱에서는 hover로, 모바일에서는 Portfolio 글자를 터치해 분류를 펼칩니다.

Contact ↗는 https://www.linkedin.com/in/hi-song-jeong-981910327/ 프로필을 새 탭으로 엽니다. 기존 /contact/ 페이지는 이전 주소 호환을 위해 유지하며 메뉴에서는 연결하지 않습니다.

## 메인 화면 이미지 교체

메인은 오른쪽 정렬의 세로형 작품 3열과 넓은 여백으로 구성했습니다. 전용 스타일은 assets/css/home.css입니다. index.html의 각 .home-project 안 .visual 요소를 img.home-image로 교체하고 src에 assets/images/이미지파일명을 입력하세요. 실제 작품 이미지는 원본 프로젝트에 없어 자리표시자를 유지했습니다. 카드 링크는 기존 작품 상세 페이지로 연결됩니다.

## 공통 헤더와 이미지 비율 갤러리

모든 페이지의 헤더는 style.css 한 곳에서 높이(데스크톱 94px, 모바일 72px), 좌우 여백, 로고·메뉴·언어 버튼 크기를 관리합니다. home.css에는 헤더 덮어쓰기 규칙을 두지 않습니다.

홈은 데스크톱에서 여백이 있는 3점 갤러리, 모바일에서는 세로 전시 구성입니다. img.home-image의 width와 height는 auto이고 최대 크기만 제한하므로 원본 비율을 유지하며 사진을 자르지 않습니다. 현재 프로젝트에는 실제 대표 사진 파일이나 이미지 경로 설정이 없어 세 영역은 서로 다른 비율의 자리표시자입니다. 실제 사진을 적용하려면 index.html에서 각 .visual 전체를 img.home-image로 교체하세요. 예: img 요소에 class="home-image", src에 실제 assets/images/ 파일 경로, alt에 사진 설명을 지정합니다. 새 사진을 넣어도 CSS의 비율 수정은 필요 없습니다.

## 홈 갤러리 호버 정보

작품 아래 캡션은 없애고 .home-media 안 .home-overlay에 작품명·분류·연도를 표시합니다. 데스크톱에서는 hover 또는 키보드 포커스 시 검은 하단 그라데이션과 정보가 보이며 선택 작품은 4.5% 커지고 나머지는 4% 작아집니다. 터치 기기에서는 정보를 항상 표시하고 링크는 한 번의 탭으로 열립니다. 동작 줄이기 설정에서는 확대·축소를 끕니다. 대표 사진 교체 시 .home-media 내부 .visual만 img.home-image로 교체하고 .home-overlay는 유지하세요.
