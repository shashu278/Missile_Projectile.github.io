#include <stdio.h>
#include <math.h>

#define g 9.81 

void projectileMotion(float initial_velocity, float angle, float t, float time_interval) {
    float Ux, Uy, xt, yt, maxHeight, range, time_of_flight, y;

    angle = angle * M_PI / 180.0;

    Ux = initial_velocity * cos(angle);
    Uy = initial_velocity * sin(angle) - g * t;

    xt = Ux * t;
    yt = (initial_velocity * sin(angle)) * t - 0.5 * g * pow(t, 2);

    maxHeight = (pow(initial_velocity * sin(angle), 2)) / (2 * g);

    range = (pow(initial_velocity, 2) * sin(2 * angle)) / g;

    time_of_flight = 2 * (initial_velocity * sin(angle)) / g;

    printf("Horizontal component of velocity (Ux): %.2f m/s\n", Ux);
    printf("Vertical component of velocity (Uy): %.2f m/s\n", Uy);
    printf("Horizontal displacement at time t: %.2f m\n", xt);
    printf("Vertical displacement at time t: %.2f m\n", yt);
    printf("Time of flight: %.2f s\n", time_of_flight);
    printf("Maximum height: %.2f m\n", maxHeight);
    printf("Horizontal range: %.2f m\n", range);
    
    for (float i = 0; i <= t; i += time_interval) {
        xt = Ux * i;
        y = tan(angle) * xt - (g * pow(xt, 2)) / (2 * pow(Ux, 2));
        printf("At t = %.2f, y = %.2f m\n", i, y);
    }
}

int main() {
    float initial_velocity, angle, t, time_interval;

    printf("Enter the initial velocity (m/s): ");
    scanf("%f", &initial_velocity);

    printf("Enter the angle of projection (in degrees): ");
    scanf("%f", &angle);

    printf("Enter the time of projection (in seconds): ");
    scanf("%f", &t);

    printf("Enter the time interval (in seconds): ");
    scanf("%f", &time_interval);

    projectileMotion(initial_velocity, angle, t, time_interval);

    return 0;
}