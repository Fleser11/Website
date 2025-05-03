# MA3740 Final Project

# Connor Fleser, Steve Forgrave, Dallas Grandy

# An Investigation into Handwriting Speeds: 
# An Analysis of Dominant and Non-Dominant Hands Utilizing 
# Varied Sentence Structures

# The necessary packages and libraries used in the data analysis.
install.packages('lme4')
install.packages('lmerTest')
install.packages('sjPlot')
library('lme4')
library('lmerTest')
library('sjPlot')

# Reading in the wide csv file.
speeds <- read.csv('MA3740.data.collection.wide.csv')

# Creating the three different box plots used in the report.
# First one is Figure 4, second one is Figure 2, and third one is Figure 3.
boxplot(speeds$uppDom, speeds$uppNDom, speeds$lowDom, speeds$lowNDom, speeds$regDom, speeds$regNDom, 
        names = c('Upper-case', 'Upper-case', 'Lower-case', 'Upper-case', 'Regular-case', 'Regular-case'),
        xlab = 'Sentence Structure', ylab = 'Time (seconds)', main = 'Time vs. Writing Situation', col = 4:5)
legend('topleft', c('Dominant', 'Non-Dominant'), fill = 4:5)

boxplot(speeds$uppDom, speeds$lowDom, speeds$regDom, 
        names = c('Upper-case', 'Lower-case', 'Regular-case'),
        xlab = 'Sentence Structure', ylab = 'Time (seconds)', main = 'Dominant Hand Time vs. Sentence Structure', col = 4)
boxplot(speeds$uppNDom, speeds$lowNDom, speeds$regNDom, 
        names = c('Upper-case', 'Lower-case', 'Regular-case'),
        xlab = 'Sentence Structure', ylab = 'Time (seconds)', main = 'Non-Dominant Hand Time vs. Sentence Structure', col = 4)

#Summary Statistics of each Group.
sapply(speeds[,6:11], mean)
sapply(speeds[,6:11], sd)
sapply(speeds[,6:11], max)
sapply(speeds[,6:11], min)
sapply(speeds[,6:11], median)

# A bit of code to convert the data to long form so that it may be used to make the model.
hand <- c('Dominant', 'Non Dominant')#the current hand of the entry
case <- c('Upper', 'Lower', 'Regular')#the current case of the entry
MA3740.data.collection.long <- data.frame()#the final data frame all of the data is going to be put into
for (x in 1:23){#For each individual
  for(y in 1:3){#for each case
    for(z in 1:2){#for both dominant and non dominant hand
      if (y == 1){
        i <- 6
      }
      else if(y == 2){
        i <- 8
      }
      else{
        i <- 10
      }
      if (z == 2){
        i <- i+1
      }
      # Create an entry for each individual time with all of the characteristics preserved
      moddedSpeeds <- rbind(moddedSpeeds, cbind(id = speeds$id[x], gender = speeds$gender[x],
            age = speeds$age[x], major = speeds$major[x], dominant = speeds$hnd[x],
            case = case[y], hand = hand[z], time = speeds[x, i]))
    }
  }
}

# Changing the columns to factors instead of strings.
moddedSpeeds <- read.csv("MA3740.data.collection.long.csv", stringsAsFactors = TRUE)
moddedSpeeds$id <- as.factor(moddedSpeeds$id)#Converting factors to factors
moddedSpeeds$case <- as.factor(moddedSpeeds$case)
moddedSpeeds$hand <- as.factor(moddedSpeeds$hand)
moddedSpeeds$age <- as.factor(moddedSpeeds$age)
moddedSpeeds$time <- as.numeric(moddedSpeeds$time)
moddedSpeeds$major <- as.factor(moddedSpeeds$major)

# Writing the data for usage in SAS and for report.
write.csv(moddedSpeeds,file = 'MA3740.data.collection.long.csv', row.names = F)

#Actual Interpretation of the Data. Creating an Interaction Plot.
interaction.plot(moddedSpeeds$hand, moddedSpeeds$case, moddedSpeeds$time, 
                 main = 'Effect of Using Dominant/Non-Dominant Hand for Sentence Structure', 
                 xlab = 'Dominant or Non-Dominant', ylab = 'Time(seconds)', trace.label = 'Structure', 
                 col = c(2:4), lty = 'solid')

# Performing the actual model.
model <- lmer(time~case * hand + (1|id), moddedSpeeds) # Uses case and hand as fixed variables and id as a random variable

# Making fitted vs. residuals plot
plot(model,
     xlab = 'Fitted Values', ylab = 'Residual Values', main = 'Fitted vs. Residual Values')

# MAKING Q-Q Plot
qqnorm(residuals(model),
       main = 'Normal Q-Q Plot of Residuals')
qqline(residuals(model))

summary(model) #Summary of the data

anova(model)   #Anova test of the iterations and thier effect on the datadifflsmeans(model, test.effs = c("case", 'hand'), ddf="Kenward-Roger") #Post hoc comparisons

# Not Used, but an interesting graph.
plot_model(model, ci.lvl = .95) #Another plot of the data