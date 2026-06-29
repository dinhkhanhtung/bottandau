"use client";

import React, { useState, useEffect, useRef } from 'react';

// Hook để phát hiện phần tử xuất hiện trên màn hình
function useIntersectionObserver(options: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options]);

  return [ref, isInView] as const;
}

// Component đếm số chạy hiệu ứng tăng dần
function Counter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.2 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsSection() {
  const stats = [
    { value: 1200, label: 'Đồng niên Tân Dậu', suffix: '+', icon: '👥' },
    { value: 1500, label: 'Giao dịch hỗ trợ chéo', suffix: '+', icon: '🤝' },
    { value: 98, label: 'Mức độ tin cậy', suffix: '%', icon: '🌟' },
    { value: 650, label: 'Sản phẩm niêm yết', suffix: '+', icon: '🛍' },
  ];

  return (
    <section id="about" className="py-12 sm:py-16 border-y border-neutral-900 bg-neutral-950/45 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-center mb-3 text-2xl sm:text-3xl text-amber-500/80 group-hover:scale-110 transition-transform">
                <span>{stat.icon}</span>
              </div>
              <div className="text-2xl sm:text-4xl font-black text-neutral-100 mb-1">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-500 font-extrabold uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
