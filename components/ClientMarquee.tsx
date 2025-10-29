'use client';

import Image from 'next/image';

const clientLogos = [
  'ascent.png',
  'ATA.png',
  'ATIQ.png',
  'axon.png',
  'DFC.png',
  'govt ajk.png',
  'govt punjab.png',
  'grower.png',
  'HB.png',
  'lacas.png',
  'nca.png',
  'NDS.png',
  'nespak.png',
  'pcl.jpeg',
  'pie.jpeg',
  'ppl.png',
  'qel.jpeg',
  'the urban unit.png',
  'treet coorporation.jpeg',
  'tsi.png'
];

export default function ClientMarquee() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold">Our Clients</h2>
          <p className="text-gray-600 mt-2">Trusted by organizations across Pakistan</p>
        </div>
        <div className="client-marquee relative">
          <div className="marquee-track">
            {/* Group 1 */}
            <div className="marquee-gap">
              {clientLogos.map((logo, index) => (
                <Image
                  key={`group1-${index}`}
                  src={`/client-logos/${logo}`}
                  alt={logo.replace(/\.(png|jpeg)$/, '')}
                  width={100}
                  height={72}
                  className="client-logo"
                  style={{ width: 'auto', height: 'auto' }}
                />
              ))}
            </div>
            {/* Group 2 (duplicate for seamless loop) */}
            <div className="marquee-gap">
              {clientLogos.map((logo, index) => (
                <Image
                  key={`group2-${index}`}
                  src={`/client-logos/${logo}`}
                  alt={logo.replace(/\.(png|jpeg)$/, '')}
                  width={100}
                  height={72}
                  className="client-logo"
                  style={{ width: 'auto', height: 'auto' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
