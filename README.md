# SNU Scheduler

Welcome to SNU Scheduler!  
SNU Scheduler is a project aiming to automate the process of generating a schedule.  
For now, we have got the very basics.  
You can add several subjects you would like to take.

The input should be like:

-   Subject Name: Math 101
-   Monday Time: 3-4, 5-6, 7-8 (Any regular expression that goes like [Number, Other Characters, Number] as one set for each interval.)
-   Tuesday Time:
-   Wednesday Time: 4-5
-   Thursday Time:
-   Friday Time:
-   Weight: 7 (This value must be between 1 and 10)

Then, we take all of your subjects and generate the top 6 schedules that maximize weight sum.

The values for time are stored like

-   Monday Time: 3,4,5,6,7,8  
    We don't provide a neat frontend yet.

https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/

**DEVELOP WITH EXCELLENCE**

`Happy coding!`

## 🔧 Updates

- October 3rd
  * Expanded to 5 daysOfWeek
  * Allowed Several Intervals Within One Day
  * Can Select 'mustTake' Subjects
  * Can Create&Modify Restricted TimeBlocks
  
- October 4th
  * Added automated testing for everything I've implemented so far
  
- TODO (Coming up soon)
  * Can Select 'mustTake' by group (mustTake... one of the following)
  * Can Select 'incompatible' by group (canTake... maximum one of the following)
  * Add "Number of Credits" attribute to Subjects
  * Can Select "Maximum Credit"

- TODO (Long-term) // 5단계
  * Get data from sugang.snu.ac.kr
  * Don't manually add subjects by default - select some from the prepared database.

## 💬 Support & Documentation

Visit [https://ide.goorm.io](https://ide.goorm.io) to support and learn more about using goormIDE.  
To watch some usage guides, visit [https://help.goorm.io/en/goormide]
