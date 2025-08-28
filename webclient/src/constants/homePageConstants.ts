import { CheckCircle, MessageCircle, Star, Users, Wrench } from "lucide-react";

export const features = [
    {
        icon: MessageCircle,
        title: 'Akira Chat',
        description: 'ChatGPT-style AI assistant trained specifically for motorcycle riders and enthusiasts.',
        features: ['Maintenance guidance', 'Troubleshooting help', 'Riding tips & techniques', 'Parts recommendations'],
        cta: 'Try Chatbot',
        href: '/chat',
        gradient: 'from-blue-500 to-purple-600'
    },
    {
        icon: Wrench,
        title: 'MIA (Mechanic Intelligence Assistant)',
        description: 'Advanced AI tools designed for professional motorcycle mechanics and workshops.',
        features: ['Diagnostic workflows', 'Technical documentation', 'Inventory management', 'Customer communication'],
        cta: 'Learn More',
        href: '/mia',
        gradient: 'from-orange-500 to-red-600'
    }
];

export const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Questions Answered', value: '1M+', icon: MessageCircle },
    { label: 'Accuracy Rate', value: '98%', icon: CheckCircle },
    { label: 'Expert Rating', value: '4.9/5', icon: Star },
];

export const benefits = [
    'Expert-level motorcycle knowledge at your fingertips',
    '24/7 availability for urgent maintenance questions',
    'Personalized recommendations based on your bike',
    'Step-by-step guidance for complex repairs',
    'Cost-effective alternative to shop visits',
    'Community-driven learning and support'
];