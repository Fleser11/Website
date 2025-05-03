# Install the VGAM package if you haven't already
#install.packages("VGAM")

# Load the VGAM package
library(VGAM)

# Load additional libraries
#install.packages("ggplot2")
library(ggplot2)
library(reshape2)

# Define the range for Xh
x <- seq(0, 1, by = 0.01)

# Beta distribution parameters for Xh
shape1_Xh <- 4
shape2_Xh <- 4

# Beta distribution density function for Xh
beta_density_Xh <- dbeta(x, shape1 = shape1_Xh, shape2 = shape2_Xh)

curve(dbeta(x, shape1 = shape1_Xh, shape2 = shape2_Xh), xlab = "Strength of Hand", ylab = "Probability", main = "Distribution of Hand Strength for Non-Dealer")

# Function to calculate Beta-Binomial PMF
beta_binom_pmf <- function(Xw, size, shape1, shape2) {
  return(dbetabinom.ab(Xw, size = size, shape1 = shape1 + 1, shape2 = shape2 + 1))
}

# Function to integrate Beta-Binomial PMF over Xh
integrate_beta_binom_over_Xh <- function(Xw, size) {
  # Integrate over the range of Xh
  integral <- sum(beta_density_Xh * beta_binom_pmf(Xw, size = size, shape1 = x * size, shape2 = size - x * size)) * (x[2] - x[1])
  return(integral)
}

convertToPointReturn <- function(lst){
  return (-2 * (lst[1] + lst[2] + lst[3]) + 1 * (lst[4] + lst[5]) + 2 * lst[6])
}



# Define the range for Xw
Xw_range <- 0:5

# Initialize a vector to store the integrated probabilities for each Xw
integrated_probs <- numeric(length(Xw_range))

# Perform partial integration over Xh for each Xw
for (i in 1:length(Xw_range)) {
  integrated_probs[i] <- integrate_beta_binom_over_Xh(Xw = Xw_range[i], size = 5)
}


# Print the integrated probabilities
cat("The integrated probabilities over the range are:", integrated_probs, "\n")
sum(integrated_probs)

# Plot the integrated probabilities
plot(Xw_range, integrated_probs, type = "b", col = "blue", xlab = "Tricks Won", ylab = "Integrated Probability",
     main = "Distribution of Tricks Taken")

#Distribution of hands won by dealer if called on Jack hand
dealerJackHand <- beta_binom_pmf(Xw_range, size = 5, shape1 = .45 * 5 + 1, shape2 = 5 - .3 * 5 + 1)

plot(Xw_range, dealerJackHand, type = "b", col = "blue", xlab = "Tricks Won", ylab = "Probability",
     main = "Distribution of Tricks Taken on Jack Hand")
convertToPointReturn(dealerJackHand)

dealerPoorHand <- beta_binom_pmf(Xw_range, size = 5, shape1 = .05 * 5 + 1, shape2 = 5 - .05 * 5 +1)

plot(Xw_range, dealerPoorHand, type = "b", col = "blue", xlab = "Tricks Won", ylab = "Probability",
     main = "Distribution of Tricks Taken on Poor Hand")
convertToPointReturn(dealerPoorHand)

# Define the probability and calculate shape parameters for the original plot

x <- 0:5

# Plot the first Beta-Binomial distribution to set up the plot
prob <- 0
sh1 <- prob * 5 
sh2 <- 5 - sh1
probs <- dbetabinom.ab(x, size = 5, shape1 = sh1 + 1, shape2 = sh2 + 1)
plot(x, probs, type = "b", col = 1, xlab = "Tricks Taken", ylab = "Probability",
     main = "Distribution of Tricks Taken For Different Hand Strengths")

# Loop through different probability values and add lines to the plot
for (k in seq(0, 1, 0.1)) {
  prob <- k
  sh1 <- prob * 5 
  sh2 <- 5 - sh1
  probs <- dbetabinom.ab(x, size = 5, shape1 = sh1 + 1, shape2 = sh2 + 1)
  lines(x, probs, type = "b", col = k*10 + 1)
}

#Lengend for different hand probs
legend("topright", legend = seq(0, 1, 0.1), col = 1:11, lty = 1, title = "Probability")


# Initialize an empty 2D array
expectedReturns <- array(dim = c(2, 101))

# Define the x values for the distribution (assuming you want to evaluate x from 0 to 5)
x <- 0:5

# Loop over the range of probabilities
for (i in seq(0, 1, by = 0.01)) {
  prob <- i
  sh1 <- 5 * prob
  sh2 <- 5 - sh1
  
  # Calculate the probability using dbetabinom.ab
  probs <- dbetabinom.ab(x, 5, shape1 = sh1 + 1, shape2 = sh2 + 1)
  
  # Update the expectedReturns array (correcting the indexing)
  idx <- as.integer(i * 100) + 1  # Find the index in the 2nd dimension (from 1 to 101)
  expectedReturns[1, idx] <- i  # Assign the probability to the first row
  expectedReturns[2, idx] <- convertToPointReturn(probs)  # Assign the expected return to the second row
}
print(expectedReturns)

1 - pbeta(.72, 4, 4)


####################

partial_integrate_beta_binom_over_Xh <- function(Xw, size, xMin) {
  x <- seq(xMin, 1, .01)
  beta_density_Xh <- dbeta(x, shape1 = 4, shape2 = 4) # Example definition
  
  # Integrate over the range of Xh
  integral <- sum(beta_density_Xh * beta_binom_pmf(Xw, size = size, shape1 = x * size, shape2 = size - x * size)) * (x[2] - x[1])
  return(integral)
}

# Define the range for Xw
Xw_range <- 0:5
xMin <- .66

# Initialize a vector to store the integrated probabilities for each Xw
partialIntegratedProbs <- numeric(length(Xw_range))

# Perform partial integration over Xh for each Xw
for (i in 1:length(Xw_range)) {
  partialIntegratedProbs[i] <- partial_integrate_beta_binom_over_Xh(Xw = Xw_range[i], size = 5, xMin = xMin)
}

plot(Xw_range, partialIntegratedProbs, type = "b", col = "blue", xlab = "Tricks Won", ylab = "Integrated Probability",
     main = paste("Distribution of Tricks Taken for Hands Stronger than", xMin))

pbeta(1-xMin, 4, 4)
convertToPointReturn(partialIntegratedProbs) / pbeta(1-xMin, 4, 4)

##################
prob <- 1
sh1 <- prob*5
sh2 <- 5 - sh1
probs <- dbetabinom.ab(x, size = 5, shape1 = sh1 + 1, shape2 = sh2 + 1)
plot(x, probs, type = "b", col = 1, xlab = "Tricks Taken", ylab = "Probability",
     main = "Distribution of Tricks Taken For Different Hand Strengths")
cat(probs)


curve(dbeta(x, shape1 = .5, shape2 = .2), xlab = "Strength of Hand", ylab = "Probability", main = "Distribution of Hand Strength for Non-Dealer")
