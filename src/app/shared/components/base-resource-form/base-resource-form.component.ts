import { Component, OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import toastr from "toastr";
import { switchMap } from 'rxjs/operators';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] =null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;  

  constructor(
    protected injector: Injector,
    public resource: T,
    protected baseResourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData) => T
    ) {
        this.route = this.injector.get(ActivatedRoute);
        this.router = this.injector.get(Router);
        this.formBuilder = this.injector.get(FormBuilder);
     }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction == 'new')
       this.createResource(); 
    else
      this.updateResource();
  }

  //PROTECTED METHODS
  protected setCurrentAction(){
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new"
    }
    else
    this.currentAction = "edit"
  }

  protected loadResource(){
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.baseResourceService.getById(+params.get("id")))
      ).subscribe(
        (resource) => {
          this.resource = resource
          this.resourceForm.patchValue(resource) // binds loaded category data to CategoryForm
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
      )
    }
  }

  protected setPageTitle(){
    if(this.currentAction == 'new')
       this.pageTitle = this.createPageTitle();
    else{
       this.pageTitle = this.editPageTitle();
    }       
  }

  private createResource(){
    const category: T = this.jsonDataToResourceFn(this.resourceForm.value)
    this.baseResourceService.create(category)
    .subscribe(
      resource => this.actionsForSuccess(resource),
      error => this.actionsForError(error)
    )
  }

  private updateResource(){
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)
    this.baseResourceService.update(resource).subscribe(
      resource => this.actionsForSuccess(resource),
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(resource: T){
    toastr.success("Solicitacao processada com sucesso!");
    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

    // redirect/reload component page
    this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
      () => this.router.navigate([baseComponentPath, resource.id, "edit"])
    )
  }

  private actionsForError(error){
    toastr.error("Ocorreu um erro ao processar a sua solicitacao");
    this.submittingForm = false;
    if(error.status === 422)
       this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicacao com o servidor. por favor, tente mais tarde."]   
  }

  protected abstract buildResourceForm(): void;

  protected abstract createPageTitle(): string;

  protected abstract editPageTitle(): string;

}