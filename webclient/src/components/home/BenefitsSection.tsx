import React from 'react'
import { motion } from 'framer-motion'
import { steps } from '@/constants/homePageConstants'

const BenefitsSection = () => {
  return (
    <section className="relative py-24 px-6">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent tracking-wider uppercase">How It Works</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            Three Steps to Expert Guidance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether it&apos;s a quick question or a full diagnostic workflow, Akira delivers results in seconds.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[28px] top-8 bottom-8 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex items-start gap-6"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl border border-accent/20 bg-accent/5 backdrop-blur-sm flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-[10px] font-mono font-bold text-accent bg-background border border-accent/20 rounded-full w-6 h-6 flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection