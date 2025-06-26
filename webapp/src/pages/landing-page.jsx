"use client";

import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import Button from "../components/ui/button";

const LandingPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn without limits</h1>
        <p className="text-lg md:text-xl mb-6">
          Join EduRev and access high-quality courses on any topic, anytime.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild className="px-6 py-3 text-lg">
            <Link to="/sign-up">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="px-6 py-3 text-lg text-white hover:text-blue-600 border-white"
          >
            <Link to="/home">Browse Courses</Link>
          </Button>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Courses</h2>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((id) => (
            <Card key={id}>
              <img
                src={`https://via.placeholder.com/400x200?text=Course+${id}`}
                alt={`Course ${id}`}
                className="h-40 w-full object-cover rounded-t-md"
              />
              <CardContent>
                <CardTitle>Course Title {id}</CardTitle>
                <CardDescription>Instructor Name</CardDescription>
              </CardContent>
              <CardFooter>
                <Link
                  to={`/course/${id}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Learn more →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
