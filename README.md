# Drug-Recommender
We  created  a  drug  recommendationdashboard by leveraging diverse data visualization princi-ples and techniques.  It allowed the user to compare drugsfor treating a particular condition or combination of con-ditions entered by the user.  Certain interactions were de-signed to efficiently display the overall average satisfaction,effectiveness and review sentiment of the drugs across dif-ferent conditions entered. A metric was designed to rank thedrugs for making a recommendation, and the visual aids areprovided as a proof for supporting recommendation madeby the system.   Text Sentiment Analysis was performed todisplay the positive and negative score with the number ofsuch reviews. This project culminated into a tool that helpsuser understand why the particular drug is best among it’scounterparts.


## Demo 

<p align="center">
  <img src="https://raw.githubusercontent.com/tanishkasingh9/Drug-Recommender/master/Demo/drugboard.gif"><br>
</p>
[Link to the dashboard]{https://sarthakshetty.github.io/}
### Team Members 
- Tanishka Singh 
- Aabhaas Gupta 
- Sarthak Shetty
- Sumitava Ghosh 

## Components of the Drug Recommendation Dashboard

-   <b>Drug Search Bar:</b> An input text box with search button for user to enter the condition. It comes with a drop down menu that lists the conditions from the dataset. The condition is filtered according to the presence of common drugs between the existing list of searched symptoms. This reduces the load of schema automation according to the Hicks law. The search bar also contains appropriate amount of hint texts to help user navigate with ease. 
-   <b>Drug Board:</b> This was a space that shows the name of the drugs analyzed in the visualizations and cues, and also ordered according to the metric designed as priority. Hover capabilities on each drug name area is added to switch between drug reviews, age-effectiveness, and side-effects specifics.
-   <b>Drug Satisfaction:</b> It show the performance of the drugs as stacked bar graph of every drug for each condition entered by the user in ad hoc manner, while still maintaining the color order of staked bars for aiding comparison across the conditions. We have also placed the labels of the drugs of the same brand names together in the legend,following the Gestalt’s Principle of Proximity.
-   <b>Drug Reviews:</b> Sentiment scores are generated using Vader polarity scores, and normalized over the whole comment using the mean valence of phrases and rules decided. The thresholds are used for reducing scores to positive, negative and neutral class of reviews, which are color coded to replicate the overall sentiment. 
-   <b>Drug Effectiveness:</b> The age reported by reviewers are in the interval data type, which is visualized against effectiveness of the drug for the condition mentioned. The average ratings are presented for comparison as bar chart for each age group.
-   <b>Drug Side Effects:</b> By performing word tokenization we summarize all the possible side-effects listed by the reviewers. The list is converted to set, for eliminating duplicates, and then displayed to user on hover.
