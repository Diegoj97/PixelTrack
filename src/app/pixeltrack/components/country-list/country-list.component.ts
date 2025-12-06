import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.css'
})
export class CountryListComponent implements OnInit {

  @Output() countrySelected = new EventEmitter<Country>();

  public countries = signal<Country[]>([]);
  public currentPage = signal<number>(1);
  public itemsPerPage = 10;
  public totalPages = signal<number>(0);
  public paginatedCountries = signal<Country[]>([]);

  constructor(private countriesService: CountriesService) { }

  ngOnInit(): void {
    this.countriesService.getCountries().subscribe(countries => {
      this.countries.set(countries);
      this.totalPages.set(Math.ceil(countries.length / this.itemsPerPage));
      this.updatePaginatedCountries();
    });
  }

  updatePaginatedCountries() {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCountries.set(this.countries().slice(startIndex, endIndex));
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      this.updatePaginatedCountries();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.updatePaginatedCountries();
    }
  }

  selectCountry(country: Country) {
    this.countrySelected.emit(country);
  }
}
