module Admin
  module Taggers
    class RulesController < ApplicationController
      before_action :authenticate_user!
      before_action :authorize_rule
      before_action :set_rule, only: %i[ show edit update destroy ]

      def index
        @rules = ::Taggers::Rule.all

        @pagy, @rules = pagy(@rules)
      end

      def new
        @rule = ::Taggers::Rule.new
      end

      def edit
      end

      def create
        @rule = ::Taggers::Rule.new(rule_params)
        binding.pry

        respond_to do |format|
          if @rule.save!
            format.html { redirect_to admin_taggers_rules_path, notice: 'rule created.' }
            format.json { redirect_to admin_taggers_rules_path, status: :created, notice: 'rule created.' }
          else
            format.html { render :new, status: :unprocessable_entity }
            format.json { render json: @rule.errors, status: :unprocessable_entity }
          end
        end
      end

      def update
        @rule.assign_attributes(rule_params)

        respond_to do |format|
          if @rule.save!
            format.html { redirect_to admin_taggers_rules_path, notice: 'rule updated.' }
            format.json { redirect_to admin_taggers_rules_path, status: :created, notice: 'rule updated.' }
          else
            format.html { render :new, status: :unprocessable_entity }
            format.json { render json: @rule.errors, status: :unprocessable_entity }
          end
        end
      end

      def destroy
        @rule.destroy

        respond_to do |format|
          format.html { redirect_to admin_taggers_rules_url, notice: 'rule was successfully destroyed.' }
        end
      end

      private

      def set_rule
        @rule = ::Taggers::Rule.find(params[:id])
      end

      def authorize_rule
        authorize ::Taggers::Rule
      end

      def rule_params
        params.require(:rule).permit(:rule_type, :input_structure, :tag, :keywords, applicable_fields: [])
      end
    end
  end
end
