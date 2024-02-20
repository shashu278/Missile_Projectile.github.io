import math
import numpy as np
import matplotlib.pyplot as plt

g = 9.81

def projectile_motion(initial_velocity, angle, t, time_interval):
    angle = math.radians(angle)

    Ux = initial_velocity * math.cos(angle)
    Uy = initial_velocity * math.sin(angle) - g * t

    xt = Ux * t
    yt = (initial_velocity * math.sin(angle)) * t - 0.5 * g * t**2

    maxHeight = (initial_velocity * math.sin(angle))**2 / (2 * g)

    Range = (initial_velocity**2 * math.sin(2 * angle)) / g

    time_of_flight = 2 * (initial_velocity * math.sin(angle)) / g

    print(f"Horizontal component of velocity (Ux): {Ux:.2f} m/s")
    print(f"Vertical component of velocity (Uy): {Uy:.2f} m/s")
    print(f"Horizontal displacement at time t: {xt:.2f} m")
    print(f"Vertical displacement at time t: {yt:.2f} m")
    print(f"Time of flight: {time_of_flight:.2f} s")
    print(f"Maximum height: {maxHeight:.2f} m")
    print(f"Horizontal range: {Range:.2f} m")

    t_values = np.arange(0, t + time_interval, time_interval)
    y_values = []
    for i in t_values:
        xt = Ux * i
        y = math.tan(angle)* xt - (g * (xt ** 2)) / (2 * (Ux ** 2))
        y_values.append(y)
        print(f"At t = {i:.2f}, y = {y:.2f} m")

    plt.plot(t_values, y_values)
    plt.xlabel("Time (s)")
    plt.ylabel("Height (m)")
    plt.title("Projectile Motion")
    plt.grid(True)
    plt.show()

initial_velocity = float(input("Enter the initial velocity (m/s): "))
angle = float(input("Enter the angle of projection (in degrees): "))
t = float(input("Enter the time of projection (in seconds): "))
time_interval = float(input("Enter the time interval (in seconds): "))

projectile_motion(initial_velocity, angle, t, time_interval)