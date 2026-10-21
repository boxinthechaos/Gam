# 감(go!)

AI기반 여행 일정 편성 플랫폼

## 💡 기획 배경

기존의 방식은 여행지 추천, 여행지 검색, 여행 스케줄 편성이 각각 다른 플랫폼들에게서 이루어지는 번거로움을 개선하고자 기획했습니다.

여행지 검색, 여행지 추천, 여행 스케줄 편성은 물론 여행 길에 들을 플레이리스트 제공과 여행길 경로 안내의 기능을 구현했습니다.

## 🚀 주요 기능

- 메인 화면

  ![메인 화면](./src/assets/screens/main.png)

  - 페이지 이동
  - 로그아웃 & 회원탈퇴 기능
 
- 여행지 검색

  ![여행지 검색](./src/assets/screens/searching.png)

  - 지역 내 식당 & 숙소 & 관광지 검색
  - 검색한 여행지는 내 여행 스케줄에 추가 가능
 
- AI 여행지 추천

  ![여행지 추천](./src/assets/screens/recommending.png)

  - 취향을 선택하면 AI가 여행지를 추천
  - 다시 여행지를 추천 받을 수 있다
 
- 마이페이지

  ![마이페이지](./src/assets/screens/my-page.png)

  - 내 여행 & 플레이리스트 확인 가능
  - 일정을 더 알차게 AI가 피드백 가능
  - 여행길 경로 알려주는 기능
 
- 플레이리스트 제공

  ![플레이리스트 제공](./src/assets/screens/making-playlist.png)

  - 가수 이름을 입력하고 시간을 설정하면 AI가 플레이리스트 제작
  - 곡 교체 기능
  - 플레이리스트 저장 기능

## 🛠️ 기술 스택

  - FrontEnd
    
    ![React](https://img.shields.io/badge/react-%2361DAFB?style=for-the-badge&logo=react&logoColor=black)
    ![Tailwind CSS](https://img.shields.io/badge/tailwind-%2306B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
    ![TypeScript](https://img.shields.io/badge/typescript-%233178C6?style=for-the-badge&logo=typescript&logoColor=white)
    ![HTML5](https://img.shields.io/badge/html5-%23E34F26?style=for-the-badge&logo=html5&logoColor=white)

  - Development Tool

    ![Vite](https://img.shields.io/badge/vite-%239135FF?style=for-the-badge&logo=vite&logoColor=white)
    ![git](https://img.shields.io/badge/git-%23F05032?style=for-the-badge&logo=git&logoColor=white)
    ![github](https://img.shields.io/badge/github-%23181717?style=for-the-badge&logo=github&logoColor=white)

## 🤔 트러블 슈팅

### 지도 마커 표시 문제

**문제 상황**

여행지 검색 결과를 지도에 마커로 표시하려 했으나, 마커가 찍히지 않거나 지도가 빈 화면으로 나타났음.

**원인 분석**

카카오맵 객체는 SDK 로드 후 비동기로 생성되는데, 마커를 그리는 `useEffect`가 지도 생성보다 먼저 실행되어 렌더링이 건너뛰어졌음.

**해결 과정**

- mapReady 상태를 추가하고, 지도 생성과 `relayout()`이 끝난 뒤 true로 변경함.
- 마커 렌더링 `useEffect`의 의존성에 `mapReady`를 넣어, 지도가 준비되는 순간 마커가 다시 그려지도록 함.

**배운 점**

- 검색 결과가 지도에 정상 표시되었고, 식당, 숙소, 관광지를 색상별 마커로 구분하도록 개선함.
- 외부 SDK의 비동기 생성 시점과 React 렌더링 흐름을 맞추려면 "준비 완료" 상태로 실행 조건을 제어해야 한다는 것을 배움.

## 🎯 기대 효과

- 여행 스케줄, 검색, 여행지 지정, 플레이리스트를 하나의 플랫폼에서 편성 => 편의성 증가

## 향후 개선

- 닉네임 찾기 기능 추가
- 사용자 피드백으로 디자인 개선
- 향후 실제 서비스 형태로 배포하기

```
🔑 환경 변수 설정 (.env)
VITE_KAKAO_MAP=your_kakao_map_api
```

.env 파일은 보안상 Git에 포함되어 있지 않습니다.
