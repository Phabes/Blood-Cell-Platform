import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControlOptions, FormControl, } from '@angular/forms';
import { CategoriesService, Category } from 'src/app/services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent {
  categories!: Category[];
  categories_array!: Array<{ id: number; name: Category | undefined }>;;
  checkbox_value = false;
  selectedCategory = "";
  constructor(private fb: FormBuilder, private catService: CategoriesService){
      this.catService.getCategories().subscribe(categories => 
        { 
          this.categories = categories;
          this.categories_array = Object.assign([], categories)
        })  
  }

  
  categoryForm = this.fb.group(
    {
      name: ["", Validators.required],
      checked: false,
      categoryAbove: [""],
      
    }
  );

  public getCheckboxValue() {
    return this.checkbox_value;
  }

  public getCategories() {
    return this.categories;
  }
  
  onCheckboxChange($event: any) {
    const isChecked = $event.target.checked;
    if (isChecked == false) {
      console.log('works')
      this.selectedCategory = "";
      this.categoryForm.value.checked = false;
    }
    else{
      this.categoryForm.value.checked = true;
    }
  }

  onDropdownListChange($event: any) {
    let selectedCategoryName = $event.target.value;
    this.selectedCategory = selectedCategoryName;
    this.categoryForm.value.categoryAbove = this.selectedCategory;
  }

  onSubmit() {
    console.log('this works too!')
    if (this.categoryForm.value.categoryAbove == "") {
      const data = {
        name: this.categoryForm.value.name,
      }
      console.log('no value works')
      this.catService.addCategory_noAboveCategoryChosen(data);
    }
    const aboveCategoryName = this.selectedCategory;
    const aboveCategoryID = this.categories.find(cat => cat.name == this.selectedCategory)?._id;
    const data = {
      name: this.categoryForm.value.name,
      categoryID: aboveCategoryID
    }
    this.catService.addCategory_AboveCategoryChosen(data);
  }

  

}