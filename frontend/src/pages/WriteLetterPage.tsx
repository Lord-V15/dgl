import FloatingPetals from '../components/effects/FloatingPetals';
import PageHeader from '../components/layout/PageHeader';
import LetterComposer from '../components/letter/LetterComposer';

export default function WriteLetterPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6">
      <FloatingPetals opacity={0.4} />

      <div className="relative z-10 max-w-4xl mx-auto">
        <PageHeader
          title="Write Your"
          highlightWord="Letter"
          subtitle="Pour your heart onto the page. It will be delivered with care."
        />
        <LetterComposer />
      </div>
    </div>
  );
}
