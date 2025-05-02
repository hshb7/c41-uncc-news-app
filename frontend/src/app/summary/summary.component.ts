import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SummaryComponent implements OnInit {
  chartData: any;
  loading = true;
  error = '';

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    const headers = {
      Authorization: `Bearer ${this.auth.getToken()}`
    };
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    this.http.get(`http://localhost:3000/api/chart1?t=${timestamp}`, { headers }).subscribe({
      next: (data) => { 
        this.chartData = data; 
        this.loading = false; 
        console.log('Chart data loaded:', data);
      },
      error: (err) => { 
        this.error = 'Failed to load chart data.'; 
        this.loading = false; 
        console.error('Chart data error:', err);
      }
    });
  }
}

