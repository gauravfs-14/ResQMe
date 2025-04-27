/* eslint-disable react/no-unescaped-entities */

import { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Award, Users, ShieldCheck, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | SOS Emergency Response',
  description: 'Learn about SOS Emergency Response system and our mission to keep Austin safe.',
};

export default function AboutPage() {
  return (
    <main className='flex flex-col min-h-screen'>
      
      <section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-6 lg:grid-cols-2 lg:gap-12'>
            <div className='flex flex-col justify-center space-y-4'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Our Mission
                </h1>
                <p className='max-w-[600px] text-muted-foreground md:text-xl'>
                  SOS Emergency Response was created with a simple mission: to provide instant emergency assistance to anyone in need through the simplicity of text messaging.
                </p>
              </div>
              <div>
                <Button asChild>
                  <Link href='#team'>Meet Our Team</Link>
                </Button>
              </div>
            </div>
            <div className='flex items-center justify-center'>
              <div className='relative h-80 w-full overflow-hidden rounded-lg'>
                <div className='absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-80'></div>
                <div className='absolute inset-0 flex items-center justify-center text-white p-6'>
                  <blockquote className='text-center text-xl font-medium italic'>
                    'In an emergency, every second counts. Our goal is to make those seconds work for you, not against you.'
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='mx-auto max-w-3xl space-y-6 text-center'>
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Our Story</h2>
            <div className='space-y-4 text-left'>
              <p>
                SOS Emergency Response was born at RiverHacks 2025, Austin Community College's premier hackathon. Our team of developers, designers, and community advocates came together with a mission to make emergency services more accessible to everyone in Austin.
              </p>
              <p>
                Inspired by the City of Austin's call for innovation in public safety and accessibility, we created a system that leverages AI to understand emergency text messages and coordinate rapid response - all through the simplicity of SMS.
              </p>
              <p>
                What started as a hackathon project has evolved into a comprehensive emergency response platform that serves Austin residents with reliable, accessible help when they need it most.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values */}
      <section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
        <div className='container px-4 md:px-6'>
          <div className='mx-auto max-w-5xl space-y-12'>
            <div className='space-y-4 text-center'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Our Values</h2>
              <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                The principles that guide our mission and development
              </p>
            </div>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
              <div className='flex flex-col items-center space-y-2 rounded-lg p-4'>
                <div className='rounded-full bg-primary/10 p-4'>
                  <ShieldCheck className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Safety</h3>
                <p className='text-center text-muted-foreground'>
                  Your safety is our top priority in everything we design and build.
                </p>
              </div>
              <div className='flex flex-col items-center space-y-2 rounded-lg p-4'>
              
                <div className='rounded-full bg-primary/10 p-4'>
                  <Users className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Accessibility</h3>
                <p className='text-center text-muted-foreground'>
                  Emergency services should be accessible to everyone, regardless of ability.
                </p>
              </div>
              <div className='flex flex-col items-center space-y-2 rounded-lg p-4'>
                <div className='rounded-full bg-primary/10 p-4'>
                  <Award className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Innovation</h3>
                <p className='text-center text-muted-foreground'>
                  We continuously improve our technology to provide better service.
                </p>
              </div>
              <div className='flex flex-col items-center space-y-2 rounded-lg p-4'>
                <div className='rounded-full bg-primary/10 p-4'>
                  <Heart className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-bold'>Community</h3>
                <p className='text-center text-muted-foreground'>
                  Building stronger, safer communities through technology and trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section id='team' className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='mx-auto max-w-5xl space-y-12'>
            <div className='space-y-4 text-center'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Meet Our Team</h2>
              <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                The passionate developers behind SOS Emergency Response
              </p>
            </div>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {/* Team Member 1 */}
              <div className='flex flex-col items-center space-y-4'>
                <div className='overflow-hidden rounded-full'>
                  <div className='h-32 w-32 bg-muted'></div>
                </div>
                <div className='space-y-2 text-center'>
                  <h3 className='text-xl font-bold'>Alex Johnson</h3>
                  <p className='text-sm text-muted-foreground'>Lead Developer</p>
                </div>
              </div>
              
              {/* Team Member 2 */}
              <div className='flex flex-col items-center space-y-4'>
                <div className='overflow-hidden rounded-full'>
                  <div className='h-32 w-32 bg-muted'></div>
                </div>
                <div className='space-y-2 text-center'>
                  <h3 className='text-xl font-bold'>Sam Rivera</h3>
                  <p className='text-sm text-muted-foreground'>AI Engineer</p>
                </div>
              </div>
              
              {/* Team Member 3 */}
              <div className='flex flex-col items-center space-y-4'>
                <div className='overflow-hidden rounded-full'>
                  <div className='h-32 w-32 bg-muted'></div>
                </div>
                <div className='space-y-2 text-center'>
                  <h3 className='text-xl font-bold'>Taylor Kim</h3>
                  <p className='text-sm text-muted-foreground'>UX Designer</p>
                </div>
              </div>
              
              {/* Team Member 4 */}
              <div className='flex flex-col items-center space-y-4'>
                <div className='overflow-hidden rounded-full'>
                  <div className='h-32 w-32 bg-muted'></div>
                </div>
                <div className='space-y-2 text-center'>
                  <h3 className='text-xl font-bold'>Jamie Patel</h3>
                  <p className='text-sm text-muted-foreground'>Backend Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partner Section */}
      <section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
        <div className='container px-4 md:px-6'>
          <div className='mx-auto max-w-5xl space-y-10'>
            <div className='space-y-4 text-center'>
              <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Our Partners</h2>
              <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl'>
                Working together to create a safer Austin
              </p>
            </div>
            <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
              <div className='flex items-center justify-center p-4'>
                <div className='h-12 w-full bg-muted-foreground/20 rounded flex items-center justify-center'>
                  <span className='text-muted-foreground font-medium'>City of Austin</span>
                </div>
              </div>
              <div className='flex items-center justify-center p-4'>
                <div className='h-12 w-full bg-muted-foreground/20 rounded flex items-center justify-center'>
                  <span className='text-muted-foreground font-medium'>Austin EMS</span>
                </div>
              </div>
              <div className='flex items-center justify-center p-4'>
                <div className='h-12 w-full bg-muted-foreground/20 rounded flex items-center justify-center'>
                  <span className='text-muted-foreground font-medium'>webAI</span>
                </div>
              </div>
              <div className='flex items-center justify-center p-4'>
                <div className='h-12 w-full bg-muted-foreground/20 rounded flex items-center justify-center'>
                  <span className='text-muted-foreground font-medium'>ACC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}