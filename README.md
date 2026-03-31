<img width="878" height="529" alt="스크린샷 2026-03-26 165744" src="https://github.com/user-attachments/assets/c17703f2-a710-42e3-b1e6-0be9f87660f9" /># GAM
## 성능 최적화
● Before : 2.45초 소요<br>
<img width="878" height="529" alt="스크린샷 2026-03-26 165744" src="https://github.com/user-attachments/assets/597973aa-a6c6-4626-828a-e70195351c04" />
- 문제사항 : 이메일 인증 버튼을 클릭 하였을 때 바로 이메일을 보내지 않고 2.45초 후에 보내지는 현상이 발생하여 버튼이 재대로 클릭 되지 않았다고 판단하여 여러번 이메일 인증 버튼을 클릭하는 현상이 발생
<br>
● After : 214ms 소요 (약 91% 속도 향상)<br>
<img width="880" height="530" alt="스크린샷 2026-03-26 165843" src="https://github.com/user-attachments/assets/9c7ebedc-161c-4dbf-8809-ffee5a0ed4e8" />
- 해결방법 : Spring Boot의 `Async`어노테이션 활용 하여 백그라운드 스레드에서 비동기로 처리하도록 리펙토링
- 성과 : 메일 전송 완료 여부와 상관없이 클라이언트에서 즉각적으로 응답을 반환하여 서버 응답 시간을 2.45초에서 214ms로 10배 이상 단축 시켜 사용자가 이메일 인증 버튼을 여러번 클릭하는 상황을 방지함
