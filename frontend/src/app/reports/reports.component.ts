import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ReportsComponent implements OnInit {
  chartData: any;
  loading = true;
  error = '';
  // Colors for the research areas - one for each category
  colors = [
    '#0077b6', // Computer & Information Sciences - blue
    '#ff7b00', // Engineering - orange
    '#6a994e', // Physical Sciences - green
    '#bc4749', // Social Sciences - red
    '#2ec4b6', // Health Sciences - teal
    '#9932cc', // Other Sciences - purple
    '#ff66b2'  // Non-Science & Engineering - pink
  ];

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    const headers = {
      Authorization: `Bearer ${this.auth.getToken()}`
    };
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    this.http.get(`http://localhost:3000/api/chart2?t=${timestamp}`, { headers }).subscribe({
      next: (data) => { 
        this.chartData = data; 
        this.loading = false; 
        console.log('Reports data loaded:', data);
      },
      error: (err) => { 
        this.error = 'Failed to load chart data.'; 
        this.loading = false; 
        console.error('Reports data error:', err);
      }
    });
  }

  // No pie segment styling needed anymore as we're using horizontal bars
  // This is intentionally left blank
}

