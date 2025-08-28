import React from 'react'
import { motion } from 'framer-motion'
import { benefits } from '@/constants/homePageConstants'
import { CheckCircle, Zap } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'

const BenefitsSection = () => {
  return (
    <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Why Choose Akira?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of riders and mechanics who trust Akira for reliable, expert-level motorcycle guidance.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass rounded-2xl p-8 border border-border/50">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
                      <Zap className="w-8 h-8 text-accent-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Ready to Get Started?</h3>
                    <p className="text-muted-foreground">Join the future of motorcycle assistance today.</p>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <Button variant="hero" size="lg" asChild>
                      <Link href="/chat">Start Chatting with Akira</Link>
                    </Button>
                    <Button variant="outline" size="lg">
                      Schedule a Demo
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  )
}

export default BenefitsSection