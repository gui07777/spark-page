import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { enviroment } from '../../enviroments/enviroment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  @ViewChild('cursorDot') cursorDot!: ElementRef;
  @ViewChild('cursorRing') cursorRing!: ElementRef;

  isScrolled = false;
  menuOpen = false;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  // ── Contato ──────────────────────────────────────────────────────────────
  private readonly phone = '5511969569887';
  private readonly waMessage = encodeURIComponent(
    'Olá! Vim pelo site da Spark Technology e gostaria de solicitar um orçamento. 🚀'
  );
  readonly whatsappUrl = `https://wa.me/${this.phone}?text=${this.waMessage}`;

  // ── EmailJS ───────────────────────────────────────────────────────────────

  formData = { name: '', email: '', service: '', message: '' };

  services = [
    { icon: '🚀', title: 'Landing Pages', desc: 'Páginas de alta conversão para campanhas de anúncios. Cada elemento projetado para transformar cliques em clientes reais.' },
    { icon: '💻', title: 'Sites Institucionais', desc: 'A vitrine digital que sua empresa merece. Rápido, responsivo e com design alinhado à sua identidade visual.' },
    { icon: '⚡', title: 'Performance & SEO', desc: 'Código limpo e otimizado para que seu site carregue em menos de 2 segundos e seja encontrado facilmente no Google.' },
    { icon: '🎨', title: 'UI/UX Design', desc: 'Interfaces que encantam e convertem. Design centrado no usuário, testado e validado antes de ir ao ar.' },
  ];

  diffs = [
    { icon: '⚡', title: 'Entrega em 4 semanas', desc: 'Do briefing ao site no ar. Sem enrolação.' },
    { icon: '📈', title: 'Foco em conversão', desc: 'Cada decisão de design é tomada para vender mais.' },
    { icon: '🛡️', title: 'Suporte contínuo', desc: '30 dias de suporte gratuito após a entrega.' },
    { icon: '🔍', title: 'SEO desde o dia 1', desc: 'Seu site indexado e rankeando desde o início.' },
  ];

  process = [
    { title: 'Briefing', desc: 'Entendemos seu negócio, seus objetivos e seu público em uma call rápida.' },
    { title: 'Design', desc: 'Criamos o visual completo para aprovação antes de escrever uma linha de código.' },
    { title: 'Desenvolvimento', desc: 'Código limpo, performático e responsivo para todos os dispositivos.' },
    { title: 'Entrega & Suporte', desc: 'Publicamos, treinamos e ficamos disponíveis por 30 dias.' },
  ];

  private mouseMoveHandler = (e: MouseEvent) => {
    const dot = this.cursorDot?.nativeElement;
    const ring = this.cursorRing?.nativeElement;
    if (dot && ring) {
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      setTimeout(() => {
        ring.style.left = e.clientX + 'px';
        ring.style.top = e.clientY + 'px';
      }, 60);
    }
  };

  ngOnInit() {
    document.addEventListener('mousemove', this.mouseMoveHandler);
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  scrollToContact() {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  async onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    try {
      // Chama a API do EmailJS diretamente via fetch (sem precisar instalar pacote)
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: enviroment.emailjs.serviceId,
          template_id: enviroment.emailjs.templlateId,
          user_id: enviroment.emailjs.publicKey,
          template_params: {
            from_name: this.formData.name,
            from_email: this.formData.email,
            service: this.formData.service || 'Não informado',
            message: this.formData.message,
          },
        }),
      });

      if (response.ok) {
        this.submitSuccess = true;
        this.formData = { name: '', email: '', service: '', message: '' };
      } else {
        this.submitError = true;
      }
    } catch (err) {
      console.error('EmailJS error:', err);
      this.submitError = true;
    } finally {
      this.isSubmitting = false;
    }
  }
}