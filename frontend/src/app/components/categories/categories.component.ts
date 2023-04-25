import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent {
  categories!: Category[];
  categories_array!: Array<{ id: number; name: Category | undefined }>;
  checkbox_value = false;
  selectedCategory = '';
  wasCategoryCorrectlyAdded: boolean | null = null;

  constructor(private fb: FormBuilder, private catService: CategoriesService) {
    this.catService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.categories_array = Object.assign([], categories);
    });
  }

  ngOnInit() {
    this.wasCategoryCorrectlyAdded = null;
  }

  categoryForm = this.fb.group({
    name: ['', Validators.required],
    checked: false,
    categoryAbove: [''],
  });

  public getCheckboxValue() {
    return this.checkbox_value;
  }

  public getCategories() {
    return this.categories;
  }

  onCheckboxChange($event: any) {
    const isChecked = $event.target.checked;
    this.checkbox_value = isChecked;
    if (isChecked == false) {
      this.selectedCategory = '';
      this.categoryForm.value.checked = false;
    } else {
      this.categoryForm.value.checked = true;
    }
  }

  onDropdownListChange($event: any) {
    const selectedCategoryName = $event.target.value;
    this.selectedCategory = selectedCategoryName;
    this.categoryForm.value.categoryAbove = this.selectedCategory;
  }

  resetForm = () => {
    this.categoryForm.controls['name'].setValue('');
    this.categoryForm.controls['checked'].setValue(false);
    this.categoryForm.controls['categoryAbove'].setValue('');
    this.selectedCategory = '';
    this.checkbox_value = false;
    this.categoryForm.value.name = '';
    this.categoryForm.value.checked = false;
    this.categoryForm.value.categoryAbove = '';
  };

  onSubmit() {
    if (this.categoryForm.value.categoryAbove == '') {
      const data = {
        name: this.categoryForm.value.name,
      };
      this.catService
        .addCategory_noAboveCategoryChosen(data)
        .subscribe((data) => {
          if (data.action == 'CATEGORY CORRECTLY ASSIGNED') {
            this.wasCategoryCorrectlyAdded = true;
            this.resetForm();
            this.categories.push(data.category);
          } else this.wasCategoryCorrectlyAdded = false;
        });
    } else {
      const aboveCategoryID = this.categories.find(
        (cat) => cat.name == this.selectedCategory
      )?._id;
      const data = {
        name: this.categoryForm.value.name,
        categoryID: aboveCategoryID,
      };
      this.catService
        .addCategory_noAboveCategoryChosen(data)
        .subscribe((res) => {
          if (res.action == 'CATEGORY CORRECTLY ASSIGNED') {
            this.catService
              .addCategory_AboveCategoryChosen(data, res.category._id)
              .subscribe((response) => {
                if (response.action == 'SUBCATEGORY CORRECTLY ASSIGNED') {
                  this.wasCategoryCorrectlyAdded = true;
                  this.resetForm();
                  this.categories.push(res.category);
                } else this.wasCategoryCorrectlyAdded = false;
              });
          } else this.wasCategoryCorrectlyAdded = false;
        });
    }
  }
}
