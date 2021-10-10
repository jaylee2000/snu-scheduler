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
	
-   TODO (Coming up soon) // 5단계
    -   Can choose subject from prepared databse from sugang.snu.ac.kr
	-   Can choose subjects for mustTakeGroups by searching through 'shopping cart'

-   TODO (Long-term)
    -   Add authorization & authentication
	-   Recommendation system (교양 X학점 들으실래요?)
	-   Take more parameters than just 'importance(=weight)' to provide better recommendations
	    * Load(로드), Honey(당도), Lecture Quality(강의력), Easy-Grade(학점 잘 주는 정도)
		* For each lecture, these parameters are given by default via Everytime/Snulife Lecture Reviews. However, the user can change the values manually.
		* Wanted range of credits(원하는 학점 수), Honey-bias/quality-bias/easy-grade-bias(당도 우선, 강의력 우선, 학점뿌리개 우선)
	-   Improve search engine
	    * When adding to shopping cart, if someone typed '기전실', we should be able to find '기초전자기학 이론 및 실습' just like SNUTT does.
		* Moreover, if someone types '기절실', it would be great if we could display "Did you mean... 기전실?" With a link that searches for 기전실.

## 💬 Support & Documentation
//TODO