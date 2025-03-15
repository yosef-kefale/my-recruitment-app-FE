import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function JobDetail() {
  return (
    <div className="w-full bg-gray-100">
      {/* Hero Section */}
      <div className="bg-sky-400 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold">Senior UX/UI Designer</h1>
        <h2 className="text-2xl mt-2">at Circlebox Creative</h2>
        <p className="mt-4 max-w-xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fermentum
          diam id ligula semper justo rhoncus.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button
            className="w-44 h-14 bg-sky-600 text-stone-200 font-bold"
          >
            VIEW COMPANY
          </Button>
          <Button className="w-44 h-14 bg-sky-600 text-stone-200 font-bold">
            APPLY FOR THIS JOB
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Job Details Section */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl mb-4 font-bold text-gray-400">
                About this role
              </h3>

              <div className="flex items-center gap-4">
                {/* Company Logo */}
                <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-gray-200">
                  <Image
                  width={80}
                  height={80}
                    src="/logo.webp"
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Job Details */}
                <div>
                  <p className="text-lg font-bold">
                    Senior UI/UX Designer
                    <span className="text-gray-400 font-normal">
                      {" "}
                      (Full Time)
                    </span>
                  </p>
                  <p className="mt-2">
                    Circlebox Creative - Royston, Hertfordshire, UK
                  </p>
                  <p className="font-semibold text-md">£35 - 45,000 + Benefits</p>
                </div>
              </div>

              <p className="mt-4 text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque eros dui, interdum sed iaculis a, varius in libero.
              </p>
              <h4 className="mt-6 font-bold">Skills</h4>
              <div className="flex gap-2 flex-wrap mt-2">
                {[
                  "User Experience",
                  "User Interface",
                  "Photoshop",
                  "Prototyping",
                  "Wireframes",
                ].map((skill) => (
                  <Badge key={skill} className="bg-blue-500 py-2 text-white">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div>
                <h4 className="mt-6 font-bold">Description</h4>
                <p className="mt-4 text-gray-700 text-sm">
                  Contrary to popular belief, Lorem Ipsum is not simply random
                  text. It has roots in a piece of classical Latin literature
                  from 45 BC, making it over 2000 years old. Richard McClintock,
                  a Latin professor at Hampden-Sydney College in Virginia,
                  looked up one of the more obscure Latin words, consectetur,
                  from a Lorem Ipsum passage, and going through the cites of the
                  word in classical literature, discovered the undoubtable
                  source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of
                  "de Finibus Bonorum et Malorum" (The Extremes of Good and
                  Evil) by Cicero, written in 45 BC. This book is a treatise on
                  the theory of ethics, very popular during the Renaissance. The
                  first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
                  comes from a line in section 1.10.32.
                </p>

                <p className="mt-4 text-gray-700 text-sm">
                  The standard chunk of Lorem Ipsum used since the 1500s is
                  reproduced below for those interested. Sections 1.10.32 and
                  1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are
                  also reproduced in their exact original form, accompanied by
                  English versions from the 1914 translation by H. Rackham.
                </p>
              </div>

              <div>
                <h4 className="mt-6 font-bold">Benefits</h4>
                <p className="mt-4 text-gray-700">
                  This job offers the following benefits:
                </p>

                <div className="flex gap-3 flex-wrap mt-4">
                  <Card className="w-44 h-16 text-sm text-sky-500 border-sky-500 flex items-center justify-center rounded-lg shadow-md">
                    HEALTH INSURANCE
                  </Card>

                  <Card className="w-44 h-16 text-sm text-sky-500 border-sky-500 flex items-center justify-center rounded-lg shadow-md">
                    FLEXIBLE HOURS
                  </Card>

                  <Card className="w-44 h-16 text-sm text-sky-500 border-sky-500 flex items-center justify-center rounded-lg shadow-md">
                    COMPANY CAR
                  </Card>

                  <Card className="w-44 h-16 text-sm text-sky-500 border-sky-500 flex items-center justify-center rounded-lg shadow-md">
                    SHARE SCHEME
                  </Card>

                  <Card className="w-44 h-16 text-sm text-sky-500 border-sky-500 flex items-center justify-center rounded-lg shadow-md">
                    PENSION SCHEME
                  </Card>

                  <Card className="w-44 h-16 text-sm text-sky-500 border-sky-500 flex items-center justify-center rounded-lg shadow-md">
                    GYM MEMBERSHIP
                  </Card>
                </div>
              </div>

              <div>
                <h4 className="mt-6 font-bold">Location</h4>
                <p className="mt-4 text-gray-700">
                  Bole, Addis Abeba, Ethiopia
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Section */}
        <div>
          <Card>
            <CardContent className="p-6">
              <Button className="w-full bg-emerald-500 font-semibold">
                Apply for this job
              </Button>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full">
                  Share on Facebook
                </Button>
                <Button variant="outline" className="w-full">
                  Share on Twitter
                </Button>
                <Button variant="outline" className="w-full">
                  Share on LinkedIn
                </Button>
              </div>
              <div className="mt-12">
                <p className="text-sm font-semibold">Job URL</p>
                <div className="relative mt-1">
                  <Input
                    value="http://digitalprofile.io/circleboxcreative"
                    readOnly
                  />
                  <Button className="absolute font-semibold py-1 right-0 top-0 bg-sky-600 text-white">
                    COPY
                  </Button>
                </div>
                </div>

                <div>
                  <h4 className="mt-10 font-bold text-gray-400">
                    More from
                    <span className="text-sky-500">Circlebox Creative</span>
                  </h4>

                  <div>
                    <h4 className="mt-6 font-bold">
                      <span>
                        <strong>Senior UI/UX Designer</strong>
                        <span className="text-gray-400 font-normal">
                          (Full Time)
                        </span>
                      </span>
                    </h4>
                    <p className="text-sm text-gray-400">
                      Circlebox Creative, Bole, Addis Abeba, Ethiopia
                    </p>
                  </div>

                  <div>
                    <h4 className="mt-6 font-bold">
                      <span>
                        <strong>Junior Designer</strong>
                        <span className="text-gray-400 font-normal">
                          (Full Time)
                        </span>
                      </span>
                    </h4>
                    <p className="text-sm text-gray-400">
                      Circlebox Creative, Bole, Addis Abeba, Ethiopia
                    </p>
                  </div>

                  <div>
                    <h4 className="mt-6 font-bold">
                      <span>
                        <strong>Web Developer</strong>
                        <span className="text-gray-400 font-normal">
                          (Full Time)
                        </span>
                      </span>
                    </h4>
                    <p className="text-sm text-gray-400">
                      Circlebox Creative, Bole, Addis Abeba, Ethiopia
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <Button className="w-full bg-emerald-500 font-semibold">
                    Apply for this job
                  </Button>
                </div>
              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
