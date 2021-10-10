# SNU Scheduler

Welcome to SNU Scheduler!  
SNU Scheduler is a project aiming to automate the process of generating a schedule.  

1) You can add several subjects you would like to take.
	Example input:  
	-   Subject Name: Math 101  
	-   Monday Time: 3-4, 5-6, 7-8  
	-   Tuesday Time:  
	-   Wednesday Time: 4-5  
	-   Thursday Time:  
	-   Friday Time:  
	-   Importance: 7  
	-   Credit: 3  

2) You can add several restricted time blocks.
	Example input:  
	-   Restriction Name: Tutoring  
	-   Monday Time: 9-11  
	-   Tuesday Time:  
	-   Wednesday Time:  
	-   Thursday Time:  
	-   Friday Time: 6-12, 13-18  

3) You can add several 'mustTakeGroups'. In the calculated schedule, a number in the range of [minSelect, maxSelect] subjects will be selected from each mustTakeGroup.
   We plan on providing a better input method for selecting member subjects.  
    Example input:  
	-   mustTakeGroup Name: Core Selectives  
	-   IDs of member subjects: 6159531309f7f95df0089a1d,6159532309f7f95df0089a20,6159533009f7f95df0089a23  
	-   minSelect Value: 2  
	-   maxSelect Value: 3  

Then, we take all of the input subjects & restrictions and generate the top 6 schedules that maximize importance(weight) sum.

**DEVELOP WITH EXCELLENCE**

`Happy coding!`

## 🔧 Updates

-   October 9 ~ 10
    -   Can select 'maxCredit' to limit number of credits to take
    -   Added basic styling using Bootstrap  
	-	Added client-side, server-side validation for inputs
	
-   TODO [5단계]: Making It Real (Comint Up Soon)
	-   실제 수강편람 데이터 sugang.snu.ac.kr에서 가져오기
	-   검색 후 장바구니에 담는 시스템 추가하기 (Will be default, although adding custom subjects will be allowed) For now: must type exact name or shortened version of exact name  
        ex: 심리학개론, 심개 (OK) / 수안개 (Not Found)
    -   Add Authorization & Authentication: Cannot alter shopping cart, restrictions/mustTakeGroups list of other users
    -   Deploy


-   TODO [6단계] Better Experience: Powered by more parameters
	-   Instead of taking ‘weight(Importance)’ take more parameters:  
	 	Load(로드), Lecture Quality(강의력), Easy-Grade(학점 잘 주는 정도)  
	-   Provide default parameter values based on Everytime, SNULife (need web-crawler)
	    User can still alter their parameters manually
	-   Preference of user
		Desired range of credits (원하는 학점 수)  
		Low-load-bias/High-load-bias/Lecture-quality-bias/Easy-grade-bias
		(낮은 로드 우선, 높은 로드 우선, 강의력 우선, 학점뿌리기 우선)  
	    	* Default preference provided (some rational value)  
		금공강 선호도, 점심시간 확보 중요도, 아침시간 기피도  
		(인기 강좌의 경우) 예상 픽순 표시해주기

-   TODO [7단계] Better search engine
	- Did you mean (this subject)? (오타 교정 및 다른 검색어 제안)  
		* ex: 기외실 → 기회실, 수안개 → 심개  
	- Search by group (전기과 3학년 과목, 인문과사회 분류 교양 교과목 등)


## 💬 Ambitions
- 	[8단계] Add recommendations / Auto-selections
-	[9단계] Track data (For improving recommendation algorithm, default parameters)
-	[10단계]
	- Improve Frontend UX/UI (Just Bootstrap; ReactJS is another huge world)
	- Use SweetJS to use macros
	- Use some sort of ejs auto-formatting tool to make styles consistent (even for .ejs files)
	- Optimize JavaScript Code (in matter of time, space complexity etc.)
	- Clean up error-handling / edge-case-handling code (especially, for src/functions.)
	- Add community for users to share custom groups (search groups, mustTakeGroups, Restrictions, popular preference parameters)
	- OAuth Switcher (you can decide to switch from Facebook Login to Kakao Login etc.)